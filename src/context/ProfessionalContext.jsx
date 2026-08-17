import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { requireSupabase, supabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { trackEvent } from '../utils/analytics';

const ProfessionalContext = createContext(null);

function normalizeWorkspaceError(error) {
  if (!error) return '';
  if (/professional_profiles|saved_courses|saved_resources|user_learning_paths/i.test(error.message || '')) {
    return 'El espacio profesional todavía no está habilitado en la base de datos.';
  }
  return error.message || 'No fue posible cargar tu espacio profesional.';
}

export function ProfessionalProvider({ children }) {
  const { user, profile: accountProfile } = useAuth();
  const [professionalProfile, setProfessionalProfile] = useState(null);
  const [savedCourses, setSavedCourses] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState('');

  const refreshWorkspace = useCallback(async () => {
    if (!user || !supabaseConfigured) {
      setProfessionalProfile(null);
      setSavedCourses([]);
      setSavedResources([]);
      setLearningPaths([]);
      setLoading(false);
      return null;
    }

    setLoading(true);
    setWorkspaceError('');
    try {
      const client = requireSupabase();
      const [profileResult, coursesResult, resourcesResult, pathsResult] = await Promise.all([
        client.from('professional_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        client.from('saved_courses').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
        client.from('saved_resources').select('*').eq('user_id', user.id).order('saved_at', { ascending: false }),
        client.from('user_learning_paths').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
      ]);

      const firstError = profileResult.error || coursesResult.error || resourcesResult.error || pathsResult.error;
      if (firstError) throw firstError;

      setProfessionalProfile(profileResult.data || null);
      setSavedCourses(coursesResult.data || []);
      setSavedResources(resourcesResult.data || []);
      setLearningPaths(pathsResult.data || []);
      return profileResult.data || null;
    } catch (error) {
      setWorkspaceError(normalizeWorkspaceError(error));
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshWorkspace();
  }, [refreshWorkspace]);

  const upsertProfessionalProfile = useCallback(async patch => {
    if (!user) return { error: 'Debes iniciar sesión.' };
    try {
      const client = requireSupabase();
      const payload = {
        user_id: user.id,
        display_name: patch.display_name || professionalProfile?.display_name || accountProfile?.full_name || user.email?.split('@')[0],
        ...patch,
      };
      const { data, error } = await client
        .from('professional_profiles')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();
      if (error) throw error;
      setProfessionalProfile(data);
      setWorkspaceError('');
      return { data };
    } catch (error) {
      const message = normalizeWorkspaceError(error);
      setWorkspaceError(message);
      return { error: message };
    }
  }, [user, professionalProfile, accountProfile]);

  const saveCourse = useCallback(async course => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    const destinationUrl = course.affiliate_url || course.original_url || course.destination_url;
    if (!destinationUrl) return { error: 'Este curso no tiene un enlace disponible.' };

    try {
      const client = requireSupabase();
      const payload = {
        user_id: user.id,
        course_id: String(course.id || course.slug),
        title: course.title || course.name,
        provider: course.provider || course.provider_name || null,
        destination_url: destinationUrl,
        image_url: course.image_url || null,
      };
      const { data, error } = await client
        .from('saved_courses')
        .upsert(payload, { onConflict: 'user_id,course_id' })
        .select()
        .single();
      if (error) throw error;
      setSavedCourses(current => [data, ...current.filter(item => item.course_id !== data.course_id)]);
      trackEvent('course_saved', { course_id: data.course_id, provider: data.provider || '' });
      return { data };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const removeCourse = useCallback(async courseId => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    try {
      const client = requireSupabase();
      const { error } = await client.from('saved_courses').delete().eq('user_id', user.id).eq('course_id', String(courseId));
      if (error) throw error;
      setSavedCourses(current => current.filter(item => item.course_id !== String(courseId)));
      return { ok: true };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const saveResource = useCallback(async resource => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    const destinationUrl = resource.source_url || resource.destination_url || resource.url;
    if (!destinationUrl) return { error: 'Este recurso no tiene un enlace disponible.' };

    try {
      const client = requireSupabase();
      const payload = {
        user_id: user.id,
        resource_id: String(resource.id || resource.slug),
        title: resource.title,
        resource_type: resource.resource_type || resource.type || null,
        destination_url: destinationUrl,
      };
      const { data, error } = await client
        .from('saved_resources')
        .upsert(payload, { onConflict: 'user_id,resource_id' })
        .select()
        .single();
      if (error) throw error;
      setSavedResources(current => [data, ...current.filter(item => item.resource_id !== data.resource_id)]);
      trackEvent('resource_saved', { resource_id: data.resource_id, resource_type: data.resource_type || '' });
      return { data };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const removeResource = useCallback(async resourceId => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    try {
      const client = requireSupabase();
      const { error } = await client.from('saved_resources').delete().eq('user_id', user.id).eq('resource_id', String(resourceId));
      if (error) throw error;
      setSavedResources(current => current.filter(item => item.resource_id !== String(resourceId)));
      return { ok: true };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const startLearningPath = useCallback(async path => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    try {
      const client = requireSupabase();
      const payload = {
        user_id: user.id,
        path_slug: path.slug,
        path_name: path.name || path.title,
        status: 'in_progress',
        current_step: 1,
      };
      const { data, error } = await client
        .from('user_learning_paths')
        .upsert(payload, { onConflict: 'user_id,path_slug' })
        .select()
        .single();
      if (error) throw error;
      setLearningPaths(current => [data, ...current.filter(item => item.path_slug !== data.path_slug)]);
      trackEvent('learning_path_started', { learning_path: data.path_slug });
      return { data };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const updateLearningPath = useCallback(async (pathSlug, patch) => {
    if (!user) return { error: 'AUTH_REQUIRED' };
    try {
      const client = requireSupabase();
      const { data, error } = await client
        .from('user_learning_paths')
        .update(patch)
        .eq('user_id', user.id)
        .eq('path_slug', pathSlug)
        .select()
        .single();
      if (error) throw error;
      setLearningPaths(current => current.map(item => item.path_slug === pathSlug ? data : item));
      return { data };
    } catch (error) {
      return { error: normalizeWorkspaceError(error) };
    }
  }, [user]);

  const value = useMemo(() => ({
    professionalProfile,
    savedCourses,
    savedResources,
    learningPaths,
    loading,
    workspaceError,
    refreshWorkspace,
    upsertProfessionalProfile,
    saveCourse,
    removeCourse,
    saveResource,
    removeResource,
    startLearningPath,
    updateLearningPath,
  }), [professionalProfile, savedCourses, savedResources, learningPaths, loading, workspaceError, refreshWorkspace, upsertProfessionalProfile, saveCourse, removeCourse, saveResource, removeResource, startLearningPath, updateLearningPath]);

  return <ProfessionalContext.Provider value={value}>{children}</ProfessionalContext.Provider>;
}

export function useProfessional() {
  const context = useContext(ProfessionalContext);
  if (!context) throw new Error('useProfessional debe usarse dentro de ProfessionalProvider');
  return context;
}
