export function a2aSessionLabel(context) {
  if (!context || typeof context !== "object") return "";
  return firstNonEmpty(
    context.root_context_id,
    context.rootContextId,
    context.protocol_context_id,
    context.protocolContextId,
    context.context_id,
    context.contextId,
    context.trace_id,
    context.traceId,
  );
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return "";
}
