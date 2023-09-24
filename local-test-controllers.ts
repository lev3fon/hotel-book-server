import axios from "axios";
import config from "./src/config";

const API_HOST = `http://localhost:${config.serverPort}/api`


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
    checkInAt: new Date(),
    checkOutAt: new Date(),
  })

  return resp.data
}

const getHotelRooms = async () => {
  const resp = await axios.get(`${API_HOST}/hotel-rooms`)
  return resp.data
}

const getFreeHotelRooms = async () => {
  const resp = await axios.get(`${API_HOST}/hotel-rooms?checkInAt=01-01-2024-15-00&checkOutAt=05-01-2024-12-00`)
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
  console.log('==========================')

  await delay(1)

  console.log('ПОЛУЧАЕМ СПИСКО НОМЕРОВ В ОТЕЛЕ СВОБОДНЫХ НА ОПРЕДЕЛЁННЫЕ ДАТЫ')
  const rooms2 = await getFreeHotelRooms()
  console.log('НОМЕРА СВОБОДНЫЕ В ОТЕЛЕ НА ОПРЕДЕЛЁННЫЕ ДАТЫ: ', rooms2)

  console.log('ПРОВЕРКА НЕКОТОРЫХ РУЧЕК ЗАВЕРШЕНА!')
}


mainLocalTest()
  .catch((err) => console.log('ПРИ ПРОВЕРКЕ НЕКОТОРЫХ РУЧЕК ЧТО-ТО УПАЛО', err))


