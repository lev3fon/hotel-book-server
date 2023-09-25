import axios from "axios";
import config from "./src/config";
import dayjs from "dayjs";

const API_HOST = `http://localhost:${config.serverPort}/api`
const checkInAtStr = '01-01-2024-15-00'
const checkOutAtStr = '05-01-2024-12-00'

const checkInAtDate = dayjs('2024-01-01 15:00').toDate()
const checkOutAtDate = dayjs('2024-01-05 12:00').toDate()

console.log('API_HOST', API_HOST)

export const delay = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};


const createBooking = async () => {
  const resp = await axios.post(`${API_HOST}/bookings`, {
    hotelRoomStrId: 'hotelRoom1',
    clientStrId: 'client1',
    checkInAt: checkInAtDate,
    checkOutAt: checkOutAtDate,
  })

  return resp.data
}

const cancelledBooking = async (strId: any) => {
  console.log('strId', strId)
  const resp = await axios.put(`${API_HOST}/bookings/${strId}`, {
    status: 'cancelled'
  })

  return resp.data
}

const getHotelRooms = async () => {
  const resp = await axios.get(`${API_HOST}/hotel-rooms`)
  return resp.data
}

const getFreeHotelRooms = async () => {
  const resp = await axios.get(`${API_HOST}/hotel-rooms?checkInAt=${checkInAtStr}&checkOutAt=${checkOutAtStr}`)
  return resp.data
}

const getClient = async () => {
  const resp = await axios.get(`${API_HOST}/clients/client1`)
  return resp.data
}

const mainLocalTest = async () => {
  console.log('ПРОВЕРКА НЕКОТОРЫХ РУЧЕК')
  console.log('ПОЛУЧАЕМ ВСЕ НОМЕРА В ОТЕЛЕ')
  const rooms = await getHotelRooms()
  console.log('ВСЕ НОМЕРА В ОТЕЛЕ:', rooms)
  console.log('==========================')

  await delay(1)

  console.log('ПОЛУЧАЕМ КЛИЕНТА ПО strId')
  const client = await getClient()
  console.log('КЛИЕНТ ПО strId:', client)
  console.log('==========================')

  await delay(1)

  console.log('СОЗДАЁМ БРОНИРОВАНИЕ')
  const booking = await createBooking()
  console.log('СОЗДАННОЕ БРОНИРОВАНИЕ: ', booking)
  const bookStrId = booking.strId
  console.log('==========================')

  await delay(1)


  console.log('СОЗДАЁМ ЕЩЕ БРОНИРОВАНИЕ НА ТЕЖЕ ДАТЫ')
  const booking2 = await createBooking()
  console.log('СОЗДАННОЕ БРОНИРОВАНИЕ НА ТЕЖЕ ДАТЫ: ', booking2)
  console.log('==========================')

  await delay(1)

  console.log('ПОЛУЧАЕМ СПИСКО НОМЕРОВ В ОТЕЛЕ СВОБОДНЫХ НА ОПРЕДЕЛЁННЫЕ ДАТЫ')
  const rooms2 = await getFreeHotelRooms()
  console.log('НОМЕРА СВОБОДНЫЕ В ОТЕЛЕ НА ОПРЕДЕЛЁННЫЕ ДАТЫ: ', rooms2)
  console.log('==========================')

  await delay(1)

  console.log('ОТМЕНЯЕМ СОЗДАННУЮ БРОНЬ')
  const booking3 = await cancelledBooking(bookStrId)
  console.log('ОТМЕНЁННАЯ БРОНЬ: ', booking3)
  console.log('==========================')

  await delay(1)

  console.log('ЕЩЁ РАЗ ПОЛУЧАЕМ СПИСКО НОМЕРОВ В ОТЕЛЕ СВОБОДНЫХ НА ОПРЕДЕЛЁННЫЕ ДАТЫ')
  const rooms3 = await getFreeHotelRooms()
  console.log('НОМЕРА СВОБОДНЫЕ В ОТЕЛЕ НА ОПРЕДЕЛЁННЫЕ ДАТЫ: ', rooms3)
  console.log('==========================')

  console.log('ПРОВЕРКА НЕКОТОРЫХ РУЧЕК ЗАВЕРШЕНА!')
}


mainLocalTest()
  .catch((err) => console.log('ПРИ ПРОВЕРКЕ НЕКОТОРЫХ РУЧЕК ЧТО-ТО УПАЛО', err))


