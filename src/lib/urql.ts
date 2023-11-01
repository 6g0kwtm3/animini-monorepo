export function nonNull<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null
}
export type JSONValue = string | number | boolean | JSONObject | JSONArray

interface JSONObject {
  [x: string]: JSONValue
}

type JSONArray = Array<JSONValue>
