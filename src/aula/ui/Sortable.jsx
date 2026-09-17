/**
 * Listas que se ordenan arrastrando. Funciona con ratón, pantalla táctil
 * y teclado (espacio para tomar, flechas para mover, espacio para
 * soltar), con anuncios en español para lectores de pantalla.
 */
import { createContext, useContext } from 'react';
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const HandleContext = createContext(null);

export function SortableList({ items, onReorder, itemLabel, children, disabled = false }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const ids = items.map((i) => i.id);
  const name = (id) => itemLabel(items.find((i) => i.id === id)) || 'el elemento';
  const position = (id) => ids.indexOf(id) + 1;

  const onDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const next = arrayMove(items, ids.indexOf(active.id), ids.indexOf(over.id));
    onReorder(next);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable: 'Para mover este elemento, presiona espacio. Usa las flechas arriba y abajo para cambiar su lugar y espacio otra vez para soltarlo. Escape cancela.',
        },
        announcements: {
          onDragStart: ({ active }) => `Tomaste ${name(active.id)}, en la posición ${position(active.id)} de ${ids.length}.`,
          onDragOver: ({ active, over }) => (over ? `${name(active.id)} pasaría a la posición ${position(over.id)} de ${ids.length}.` : `${name(active.id)} está fuera de la lista.`),
          onDragEnd: ({ active, over }) => (over ? `${name(active.id)} quedó en la posición ${position(over.id)} de ${ids.length}.` : `${name(active.id)} volvió a su lugar.`),
          onDragCancel: ({ active }) => `Se canceló el movimiento. ${name(active.id)} volvió a su lugar.`,
        },
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={disabled}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

/** Elemento ordenable. El arrastre empieza solo desde <DragHandle />. */
export function SortableItem({ id, as: Tag = 'li', className = '', children }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
    position: 'relative',
  };
  return (
    <HandleContext.Provider value={{ attributes, listeners, setActivatorNodeRef }}>
      <Tag ref={setNodeRef} style={style} className={`${className} ${isDragging ? 'opacity-80 shadow-[var(--aula-shadow-lg)]' : ''}`}>
        {children}
      </Tag>
    </HandleContext.Provider>
  );
}

export function DragHandle({ label }) {
  const ctx = useContext(HandleContext);
  if (!ctx) return null;
  return (
    <button
      type="button"
      ref={ctx.setActivatorNodeRef}
      {...ctx.attributes}
      {...ctx.listeners}
      aria-label={label}
      title="Arrastra para ordenar"
      className="inline-flex h-8 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-[var(--aula-subtle)] hover:bg-[var(--aula-neutral-soft)] hover:text-[var(--aula-muted)] active:cursor-grabbing"
    >
      <GripVertical className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

/** Mueve un elemento una posición (alternativa a arrastrar). */
export function moveBy(items, id, delta) {
  const from = items.findIndex((i) => i.id === id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= items.length) return null;
  return arrayMove(items, from, to);
}
