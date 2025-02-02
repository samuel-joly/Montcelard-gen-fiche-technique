import { Reservation } from '@/classes/Reservation'
import { Client } from '@/helpers/client'
import { defineStore } from 'pinia'

export const useResaFilter = defineStore('resaFilter', {
  state: () => ({
    results: [] as Reservation[],
    week: 23 as number,
    year: new Date().getFullYear() as number
  }),
  getters: {
    getResas: (state): Reservation[] => state.results,
    getCurrentWeek: (state): number => state.week
  },
  actions: {
    getFirstWeekDay(): Date {
      const firstWeekDay = new Date(this.year, 0, this.week * 7)
      while (firstWeekDay.getDay() != 1) {
        firstWeekDay.setDate(firstWeekDay.getDate() - 1)
      }
      return firstWeekDay
    },
    getFromDate(date: Date): Reservation {
      return this.results.filter((e) => e.date == date)[0]
    },
    getFromId(id: number): Reservation {
      return this.results.filter((e) => e.id == id)[0]
    },
    async getCurrentWeekResa() {
      const cli = new Client()
      const firstWeekDay = this.getFirstWeekDay()
      const lastWeekDay = new Date(firstWeekDay)
      lastWeekDay.setDate(lastWeekDay.getDate() + 5)
      let weekDates = ''
      let i = 0
      while (firstWeekDay < lastWeekDay) {
        if (i != 0) weekDates += '&|'
        weekDates +=
          'date=' +
          firstWeekDay.getFullYear() +
          '-' +
          (1 + firstWeekDay.getMonth()) +
          '-' +
          firstWeekDay.getDate()
        i++
        firstWeekDay.setDate(firstWeekDay.getDate() + 1)
      }
      try {
        this.results = (await cli.get<Reservation>(new Reservation(), 0, weekDates)).data
      } catch (e) {
        console.log(e)
      }
    },
    async deleteResa(id: number) {
      const cli = new Client()
      await cli.delete('reservation', id)
      this.results.filter((e) => e.id != id)
    }
  }
})
