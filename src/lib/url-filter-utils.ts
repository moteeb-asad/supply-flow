export const parseNumberParam = (value: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

type IdLabelOption = {
  id: string;
  label: string;
};

export const setOrDeleteParam = (
  params: URLSearchParams,
  key: string,
  value?: string,
) => {
  if (value && value.trim().length > 0) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
};

export const setOrDeleteNumberParam = (
  params: URLSearchParams,
  key: string,
  value?: number,
) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    params.set(key, String(value));
  } else {
    params.delete(key);
  }
};

export const parseIdsFromLabelParam = (
  value: string | null,
  options: IdLabelOption[],
): string[] | undefined => {
  if (!value) return undefined;

  const idByLabel = new Map(options.map((option) => [option.label, option.id]));
  const ids = value
    .split(",")
    .map((label) => decodeURIComponent(label.trim()))
    .map((label) => idByLabel.get(label))
    .filter((id): id is string => Boolean(id));

  return ids.length > 0 ? ids : undefined;
};

export const serializeLabelParamFromIds = (
  ids: string[] | undefined,
  options: IdLabelOption[],
): string | undefined => {
  if (!ids || ids.length === 0) return undefined;

  const labelById = new Map(options.map((option) => [option.id, option.label]));
  const labels = ids
    .map((id) => labelById.get(id))
    .filter((label): label is string => Boolean(label));

  return labels.length > 0 ? labels.join(",") : undefined;
};
