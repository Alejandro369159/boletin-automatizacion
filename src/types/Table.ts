export type Column = {
  key: string
  label: string
}

type PossibleValue = number | string | null | undefined | number[] | string[]

export type DataItem = Record<string, PossibleValue>
