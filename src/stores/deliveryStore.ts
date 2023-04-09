import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

import { EDeliveryTypes } from '~/types/deliveryTypes'

import type { IDeliver, IDeliverAdd, IOrder, IOrderAdd, IUserRequestListWithMatches, IUserRequestMatches } from '~/types/deliveryTypes'

import { useUserStore } from './userStore'

export interface IUserDelivery {
  orderList: IOrder[]
  deliverList: IDeliver[]
}

export interface IDeliveryState {
  userStore: any
  deliveryByUserId: {
    [userId: string]: IUserDelivery | undefined
  }
}

export const useDeliveryStore = defineStore('deliveryStore', {
  persist: true,
  state: (): IDeliveryState => ({
    userStore: useUserStore(),
    deliveryByUserId: {},
  }),
  actions: {
    initUsersDelivery() {
      if (this.deliveryByUserId[this.userStore.userId] === undefined) {
        this.deliveryByUserId[this.userStore.userId] = {
          orderList: [],
          deliverList: [],
        }
      }
    },
    async addOrder(newOrder: IOrderAdd) {
      try {
        const order: IOrder = {
          ...newOrder,
          id: uuid(),
          createdat: new Date().getTime(),
        }
        this.initUsersDelivery()
        this.deliveryByUserId[this.userStore.userId]?.orderList.push(order)
        return true
      }
      catch (error) {}
    },
    async addDeliver(newDeliver: IDeliverAdd) {
      try {
        const deliver: IDeliver = {
          ...newDeliver,
          id: uuid(),
          createdat: new Date().getTime(),
        }
        this.initUsersDelivery()
        this.deliveryByUserId[this.userStore.userId]?.deliverList.push(deliver)
        return true
      }
      catch (error) {}
    },
    async removeRequest(request: (IDeliver | IOrder)) {
      let requestArrType = request.deliveryType === EDeliveryTypes.order
        ? 'orderList'
        : 'deliverList'
      
      const userRequests = this.deliveryByUserId[this.userStore.userId]
      if (userRequests === undefined) throw new Error('[removeRequest] - failed. No such a user')
      const index = userRequests[requestArrType].findIndex(req => req.id === request.id)
      if (index !== -1) {
        userRequests[requestArrType].splice(index, 1)
        return true
      }
      throw new Error('[removeRequest] - failed. Current user don\'t have such a request')
    },
    updateRequest(requestId, field, newValue) {
      try {
        const request = this.getRequestByRequestId(requestId)
        request[field] = newValue
        return true
      }
      catch (error) {
        return false
      }
    },
    addUser(userId: string) {
      this.deliveryByUserId[userId] = {
        orderList: [],
        deliverList: [],
      }
      return userId
    },
    deleteUser(userId: string) {
      delete this.deliveryByUserId[userId]
    },
  },
  getters: {
    getAllUsersIds() {
      return Object.keys(this.deliveryByUserId)
    },
    getAllUsersAllRequests() {
      return this.getAllUsersIds.flatMap(userId => this.getFlatRequestListByUserId(userId))
    },
    getCurrentUserRequests(): IUserDelivery | undefined {
      return this.deliveryByUserId[this.userStore.userId]
    },
    getFlatRequestListByUserId() {
      return (byUserId: string): (IOrder | IDeliver)[] => {
        const requestTypesList = Object.keys(this.deliveryByUserId[byUserId] ?? {}) // ('deliverList' | 'deliverList')[]
        return requestTypesList.reduce((acc, userRequestType) => {
          const obj = this.deliveryByUserId[byUserId] ?? {}
          return acc.concat(obj[userRequestType])
        }, [])
      }
    },
    getRequestByRequestId() {
      return (requestId: string) => {
        for (let i = 0; i < this.getAllUsersIds.length; i++) {
          const flatUserRequestList = this.getFlatRequestListByUserId(this.getAllUsersIds[i])
          const index = flatUserRequestList.findIndex(req => req.id === requestId)
          if (index !== -1) return flatUserRequestList[index]
        }
        throw new Error(`No request with id: ${requestId}`)
      }
    },
    getUserRequestByIdAndRequestId() {
      return (byUserId: string, requestId: string) => {
        return this.getFlatRequestListByUserId(byUserId)
          .find(req => req.id === requestId)
      }
    },
    getUserRequestMatchesByIdAndRequestId() {
      return (byUserId: string, requestId: string): IUserRequestMatches[] => {
        const matches = []
        const req = this.getUserRequestByIdAndRequestId(byUserId, requestId)
        const allUsersIdList = Object.keys(this.deliveryByUserId).filter(allId => allId !== byUserId)
        allUsersIdList.forEach(allUsersId => {
          const flatRequests = this.getFlatRequestListByUserId(allUsersId)
          flatRequests.forEach(userReq => {
            let userReqDateTime = 0
            if (userReq.date !== null) {
              if (typeof userReq.date === 'string') {
                userReqDateTime = new Date(userReq.date).getTime()
              }
              else {
                userReqDateTime = new Date(userReq.date).getTime()
              }
            }
            let reqDateTime = 0
            if (req !== undefined && req.date !== null) {
              if (typeof req.date === 'string') {
                reqDateTime = new Date(req.date).getTime()
              }
              else {
                reqDateTime = new Date(req.date).getTime()
              }
            }
            
            if (
              req !== undefined
              && userReq.cityFrom.toLowerCase() === req.cityFrom.toLowerCase()
              && userReq.cityTo.toLowerCase() === req.cityTo.toLowerCase()
              && ((userReqDateTime >= reqDateTime) || reqDateTime === 0 || userReqDateTime === 0)
            ) {
              matches.push({ ...userReq, userId: allUsersId })
            }
          })
        })
        return matches
      }
    },
    getUserRequestListWithMatches(): IUserRequestListWithMatches[] {
      const flatReqList = this.getFlatRequestListByUserId(this.userStore.userId)
      return flatReqList.map(req => {
        const matches = this.getUserRequestMatchesByIdAndRequestId(this.userStore.userId, req.id)
        return { ...req, matches }
      })
    },
  },
})
