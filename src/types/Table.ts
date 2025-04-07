export type Column = {
  key: string
  label: string
}

type PossibleValue = number | string | null | undefined | number[] | string[] | Date

export type DataItem = Record<string, PossibleValue>

export type Button = {
  label: string
  action: () => void
}
