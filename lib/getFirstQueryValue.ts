/**
 * Returns the first value for a Next.js App Router search param
 * (`string` or `string[]` from parallel routes / repeated keys).
 */
export const getFirstQueryValue = (param: string | string[] | undefined): string | null => {
  if (typeof param === "string") {
    return param;
  }

  return param?.[0] ?? null;
};
