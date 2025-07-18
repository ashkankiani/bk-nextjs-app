const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const createCatalogUser = await prisma.catalogs.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'User',
    },
  })
  const createCatalogAdmin = await prisma.catalogs.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Super Admin',
    },
  })
  const createCatalogProvider = await prisma.catalogs.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Provider',
    },
  })
  const createCatalogExecutive = await prisma.catalogs.upsert({
    where: { id: 4 },
    update: {},
    create: {
      title: 'Executive',
    },
  })

  const createPermissionsUser = await prisma.permissions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      catalogId: 1,
      admin: false,
      viewDashboard: false,
      viewReservation: false,
      addReservation: false,
      editReservation: false,
      deleteReservation: false,
      viewDraft: false,
      deleteDraft: false,
      viewServices: false,
      addServices: false,
      editServices: false,
      deleteServices: false,
      viewProviders: false,
      addProviders: false,
      editProviders: false,
      deleteProviders: false,
      viewTimesheets: false,
      addTimesheets: false,
      deleteTimesheets: false,
      viewFinancial: false,
      viewHolidays: false,
      addHolidays: false,
      editHolidays: false,
      deleteHolidays: false,
      viewDiscounts: false,
      addDiscounts: false,
      editDiscounts: false,
      deleteDiscounts: false,
      viewUsers: false,
      addUsers: false,
      editUsers: false,
      deleteUsers: false,
      exportUsers: false,
      importUsers: false,
      viewFaqs: false,
      addFaqs: false,
      editFaqs: false,
      deleteFaqs: false,
      viewSettings: false,
      editSettings: false,
      viewConnections: false,
      editConnections: false,
      viewCatalogs: false,
      addCatalogs: false,
      editCatalogs: false,
      deleteCatalogs: false,
      getSms: true,
      getEmail: true,
    },
  })
  const createPermissionsAdmin = await prisma.permissions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      catalogId: 2,
      admin: true,
      viewDashboard: true,
      viewReservation: true,
      addReservation: true,
      editReservation: true,
      deleteReservation: true,
      viewDraft: true,
      deleteDraft: true,
      viewServices: true,
      addServices: true,
      editServices: true,
      deleteServices: true,
      viewProviders: true,
      addProviders: true,
      editProviders: true,
      deleteProviders: true,
      viewTimesheets: true,
      addTimesheets: true,
      deleteTimesheets: true,
      viewFinancial: true,
      viewHolidays: true,
      addHolidays: true,
      editHolidays: true,
      deleteHolidays: true,
      viewDiscounts: true,
      addDiscounts: true,
      editDiscounts: true,
      deleteDiscounts: true,
      viewUsers: true,
      addUsers: true,
      editUsers: true,
      deleteUsers: true,
      exportUsers: true,
      importUsers: true,
      viewFaqs: true,
      addFaqs: true,
      editFaqs: true,
      deleteFaqs: true,
      viewSettings: true,
      editSettings: true,
      viewConnections: true,
      editConnections: true,
      viewCatalogs: true,
      addCatalogs: true,
      editCatalogs: true,
      deleteCatalogs: true,
      getSms: true,
      getEmail: true,
    },
  })
  const createPermissionsProvider = await prisma.permissions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      catalogId: 3,
      admin: true,
      viewDashboard: false,
      viewReservation: true,
      addReservation: true,
      editReservation: true,
      deleteReservation: true,
      viewDraft: false,
      deleteDraft: false,
      viewServices: false,
      addServices: false,
      editServices: false,
      deleteServices: false,
      viewProviders: true,
      addProviders: false,
      editProviders: true,
      deleteProviders: false,
      viewTimesheets: true,
      addTimesheets: true,
      deleteTimesheets: true,
      viewFinancial: false,
      viewHolidays: false,
      addHolidays: false,
      editHolidays: false,
      deleteHolidays: false,
      viewDiscounts: false,
      addDiscounts: false,
      editDiscounts: false,
      deleteDiscounts: false,
      viewUsers: false,
      addUsers: false,
      editUsers: false,
      deleteUsers: false,
      exportUsers: false,
      importUsers: false,
      viewFaqs: false,
      addFaqs: false,
      editFaqs: false,
      deleteFaqs: false,
      viewSettings: false,
      editSettings: false,
      viewConnections: false,
      editConnections: false,
      viewCatalogs: false,
      addCatalogs: false,
      editCatalogs: false,
      deleteCatalogs: false,
      getSms: true,
      getEmail: true,
    },
  })
  const createPermissionsExecutive = await prisma.permissions.upsert({
    where: { id: 4 },
    update: {},
    create: {
      catalogId: 4,
      admin: true,
      viewDashboard: false,
      viewReservation: true,
      addReservation: true,
      editReservation: true,
      deleteReservation: true,
      viewDraft: false,
      deleteDraft: false,
      viewServices: false,
      addServices: false,
      editServices: false,
      deleteServices: false,
      viewProviders: false,
      addProviders: false,
      editProviders: false,
      deleteProviders: false,
      viewTimesheets: false,
      addTimesheets: false,
      deleteTimesheets: false,
      viewFinancial: false,
      viewHolidays: false,
      addHolidays: false,
      editHolidays: false,
      deleteHolidays: false,
      viewDiscounts: false,
      addDiscounts: false,
      editDiscounts: false,
      deleteDiscounts: false,
      viewUsers: false,
      addUsers: false,
      editUsers: false,
      deleteUsers: false,
      exportUsers: false,
      importUsers: false,
      viewFaqs: false,
      addFaqs: false,
      editFaqs: false,
      deleteFaqs: false,
      viewSettings: false,
      editSettings: false,
      viewConnections: false,
      editConnections: false,
      viewCatalogs: false,
      addCatalogs: false,
      editCatalogs: false,
      deleteCatalogs: false,
      getSms: true,
      getEmail: true,
    },
  })

  const createAdministrator = await prisma.users.upsert({
    where: { email: '72kiany.ashkan@gmail.com' },
    update: {},
    create: {
      // role: 'ADMIN',
      catalogId: 2,
      codeMeli: '4180317125',
      fullName: 'مدیریت',
      mobile: '09120143029',
      email: '72kiany.ashkan@gmail.com',
      password: bcrypt.hashSync('4180317125', 10),
    },
  })
  const createUser1 = await prisma.users.upsert({
    where: { email: 'user1@gmail.com' },
    update: {},
    create: {
      // role: 'USER',
      catalogId: 1,
      codeMeli: '4180317121',
      fullName: 'کاربر یک',
      mobile: '09120000001',
      email: 'user1@gmail.com',
      password: bcrypt.hashSync('4180317121', 10),
    },
  })
  const createUser2 = await prisma.users.upsert({
    where: { email: 'user2@gmail.com' },
    update: {},
    create: {
      // role: 'USER',
      catalogId: 1,
      codeMeli: '4180317122',
      fullName: 'کاربر دو',
      mobile: '09120000002',
      email: 'user2@gmail.com',
      password: bcrypt.hashSync('4180317122', 10),
    },
  })
  const createUser3 = await prisma.users.upsert({
    where: { email: 'sam.maleki69@gmail.com' },
    update: {},
    create: {
      // role: 'PROVIDER',
      catalogId: 3,
      codeMeli: '4180317123',
      fullName: 'ارائه دهنده یک',
      mobile: '09031648182',
      email: 'sam.maleki69@gmail.com',
      password: bcrypt.hashSync('4180317123', 10),
    },
  })
  const createUser4 = await prisma.users.upsert({
    where: { email: 'user4@gmail.com' },
    update: {},
    create: {
      // role: 'PROVIDER',
      catalogId: 3,
      codeMeli: '4180317124',
      fullName: 'ارائه دهنده دو',
      mobile: '09120000004',
      email: 'user4@gmail.com',
      password: bcrypt.hashSync('4180317124', 10),
    },
  })

  const createService1 = await prisma.services.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'خدمت یک',
      userId: 4,
      periodTime: 60,
      price: 1000,
      capacity: 1,
      onlinePayment: true,
      codPayment: true,
      smsToAdminService: false,
      smsToAdminProvider: false,
      smsToUserService: false,
    },
  })
  const createService2 = await prisma.services.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'خدمت دو',
      userId: 5,
      periodTime: 20,
      price: 100000,
      capacity: 1,
    },
  })

  const createProvider1 = await prisma.providers.upsert({
    where: { id: 1 },
    update: {},
    create: {
      serviceId: 1,
      userId: 4,
      slotTime: 0,
    },
  })
  const createProvider2 = await prisma.providers.upsert({
    where: { id: 2 },
    update: {},
    create: {
      serviceId: 2,
      userId: 5,
      slotTime: 30,
    },
  })

  const createSettings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'رزواسیون کیان',
      url: 'https://bookingkian.ir',
      address: 'تهران، میدان ونک، برج نگار، طبقه 20 واحد 508',
      phone: '02112233000',
      theme: 'THEME1',
    },
  })

  const createConnections = await prisma.connections.upsert({
    where: { id: 1 },
    update: {},
    create: {
      bankName1: 'ZARINPAL',
      merchantId1: 'c6922ec5-830c-4d99-b5f8-cc82a39f1065',
      smsName: 'SMSIR',
      smsURL: 'https://api.sms.ir/v1',
      smsToken: 'bAEqhuwipuARtQhae446TXbKDkoKMLkf6GZUp0665wokYSg8xMHeV0eN7TT3MOtk',
      smsFrom: '3000505',
      smsCodePattern1: '555771',
      smsCodePattern2: '807885',
      smsCodePattern3: '913146',
      smsCodePattern4: '107873',
      smsCodePattern5: '340826',
      smsCodePattern6: '369912',
      smtpURL: 'cinnamon.7ho.st',
      smtpPort: 465,
      smtpUserName: 'info@papolak.ir',
      smtpPassword: 'RpndpAoSgWwj',
    },
  })

  const createTimeSheet1 = await prisma.timeSheets.upsert({
    where: { id: 1 },
    update: {},
    create: {
      serviceId: 1,
      providerId: 1,
      dayName: 'شنبه',
      dayIndex: 1,
      startTime: '10:00',
      endTime: '16:00',
    },
  })

  const createTimeSheet2 = await prisma.timeSheets.upsert({
    where: { id: 2 },
    update: {},
    create: {
      serviceId: 1,
      providerId: 1,
      dayName: 'دوشنبه',
      dayIndex: 3,
      startTime: '10:00',
      endTime: '16:00',
    },
  })
  const createTimeSheet3 = await prisma.timeSheets.upsert({
    where: { id: 3 },
    update: {},
    create: {
      serviceId: 1,
      providerId: 1,
      dayName: 'چهارشنبه',
      dayIndex: 5,
      startTime: '10:00',
      endTime: '16:00',
    },
  })

  const createTimeSheet4 = await prisma.timeSheets.upsert({
    where: { id: 4 },
    update: {},
    create: {
      serviceId: 2,
      providerId: 2,
      dayName: 'شنبه',
      dayIndex: 1,
      startTime: '10:00',
      endTime: '16:00',
    },
  })

  const createDiscount = await prisma.discounts.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'شب یلدا',
      code: 'yalda',
      type: 'PERCENT',
      amount: 50,
    },
  })

  async function importHoliday(items) {
    items.map(async (item, index) => {
      await prisma.holidays.upsert({
        where: { id: index + 1 },
        update: {},
        create: {
          date: item.date,
          title: item.title,
        },
      })
    })
  }

  const listHolidays = [
    {
      date: '1403/01/01',
      title: 'جشن نوروز/جشن سال نو',
    },
    {
      date: '1403/01/02',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/03',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/04',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/12',
      title: 'روز جمهوری اسلامی',
    },
    {
      date: '1403/01/13',
      title: 'جشن سیزده به در و شهادت حضرت علی علیه السلام',
    },
    {
      date: '1403/01/22',
      title: 'عید سعید فطر',
    },
    {
      date: '1403/01/23',
      title: 'عید سعید فطر',
    },
    {
      date: '1403/02/15',
      title: 'شهادت امام جعفر صادق علیه السلام',
    },
    {
      date: '1403/03/14',
      title: 'رحلت حضرت امام خمینی',
    },
    {
      date: '1403/03/15',
      title: 'قیام 15 خرداد',
    },
    {
      date: '1403/03/28',
      title: 'عید سعید قربان',
    },
    {
      date: '1403/04/05',
      title: 'عید سعید غدیر خم',
    },
    {
      date: '1403/04/25',
      title: 'تاسوعای حسینی',
    },
    {
      date: '1403/04/26',
      title: 'تاسوعای حسینی',
    },
    {
      date: '1403/06/04',
      title: 'اربعین حسینی',
    },
    {
      date: '1403/06/12',
      title: 'رحلت رسول اکرم؛شهادت امام حسن مجتبی علیه السلام',
    },
    {
      date: '1403/06/14',
      title: 'شهادت امام رضا علیه السلام',
    },
    {
      date: '1403/06/22',
      title: 'شهادت امام حسن عسکری علیه السلام',
    },
    {
      date: '1403/06/31',
      title: ' میلاد رسول اکرم و امام جعفر صادق علیه السلام',
    },
    {
      date: '1403/09/15',
      title: 'شهادت حضرت فاطمه زهرا سلام الله علیها',
    },
    {
      date: '1403/10/25',
      title: 'ولادت امام علی علیه السلام و روز پدر',
    },
    {
      date: '1403/11/09',
      title: 'مبعث رسول اکرم (ص)',
    },
    {
      date: '1403/11/22',
      title: 'پیروزی انقلاب اسلامی',
    },
    {
      date: '1403/11/26',
      title: 'ولادت حضرت قائم عجل الله تعالی فرجه و جشن نیمه شعبان',
    },
    {
      date: '1403/12/29',
      title: 'روز ملی شدن صنعت نفت ایران',
    },
    {
      date: '1403/12/30',
      title: ' آخرین روز سال',
    },

    {
      date: '1403/01/01',
      title: 'جشن نوروز/جشن سال نو',
    },
    {
      date: '1403/01/02',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/03',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/04',
      title: 'عیدنوروز',
    },
    {
      date: '1403/01/11',
      title: 'عید سعید فطر',
    },
    {
      date: '1403/01/12',
      title: 'روز جمهوری اسلامی و عید سعید فطر',
    },
    {
      date: '1403/01/13',
      title: 'جشن سیزده به در و شهادت حضرت علی علیه السلام',
    },
    {
      date: '1403/02/04',
      title: 'شهادت امام جعفر صادق علیه السلام',
    },
    {
      date: '1403/03/14',
      title: 'رحلت حضرت امام خمینی',
    },
    {
      date: '1403/03/15',
      title: 'قیام 15 خرداد',
    },
    {
      date: '1403/03/17',
      title: 'عید سعید قربان',
    },
    {
      date: '1403/03/25',
      title: 'عید سعید غدیر خم',
    },
    {
      date: '1403/04/14',
      title: 'تاسوعای حسینی',
    },
    {
      date: '1403/04/25',
      title: 'تاسوعای حسینی',
    },
    {
      date: '1403/06/01',
      title: 'رحلت رسول اکرم؛شهادت امام حسن مجتبی علیه السلام',
    },
    {
      date: '1403/06/02',
      title: 'شهادت امام رضا علیه السلام',
    },
    {
      date: '1403/06/10',
      title: ' شهادت امام حسن عسکری علیه السلام',
    },
    {
      date: '1403/06/19',
      title: 'میلاد رسول اکرم و امام جعفر صادق علیه السلام',
    },
    {
      date: '1403/09/04',
      title: 'شهادت حضرت فاطمه زهرا سلام الله علیها',
    },
    {
      date: '1403/10/13',
      title: 'ولادت امام علی علیه السلام و روز پدر',
    },
    {
      date: '1403/10/27',
      title: 'مبعث رسول اکرم (ص)',
    },
    {
      date: '1403/11/15',
      title: 'ولادت حضرت قائم عجل الله تعالی فرجه و جشن نیمه شعبان',
    },
    {
      date: '1403/11/22',
      title: 'پیروزی انقلاب اسلامی',
    },
    {
      date: '1403/12/20',
      title: 'شهادت حضرت علی علیه السلام',
    },
    {
      date: '1403/12/29',
      title: 'روز ملی شدن صنعت نفت ایران',
    },
  ]
  await importHoliday(listHolidays)

  async function importFaqs(items) {
    items.map(async (item, index) => {
      await prisma.faqs.upsert({
        where: { id: index + 1 },
        update: {},
        create: {
          title: item.title,
          content: item.content,
        },
      })
    })
  }

  const listFaqs = [
    {
      title: 'آیا رزرواسیون کیانی یک افزونه است؟',
      content: 'خیر یک اسکریپت پیشرفته سطح بالا است که با nextjs بر بستر prisma کدنویسی شده است.',
    },
    {
      title: 'از کجا محصول را بخریم؟',
      content: 'شما میتوانید محصول را ژاکت بخرید.',
    },
  ]
  await importFaqs(listFaqs)

  console.log({ createCatalogUser })
  console.log({ createCatalogAdmin })
  console.log({ createCatalogProvider })
  console.log({ createCatalogExecutive })
  console.log({ createPermissionsUser })
  console.log({ createPermissionsAdmin })
  console.log({ createPermissionsProvider })
  console.log({ createPermissionsExecutive })
  console.log({ createAdministrator })
  console.log({ createUser1 })
  console.log({ createUser2 })
  console.log({ createUser3 })
  console.log({ createUser4 })
  console.log({ createService1 })
  console.log({ createService2 })
  console.log({ createProvider1 })
  console.log({ createProvider2 })
  console.log({ createSettings })
  console.log({ createConnections })
  console.log({ createTimeSheet1 })
  console.log({ createTimeSheet2 })
  console.log({ createTimeSheet3 })
  console.log({ createTimeSheet4 })
  console.log({ createDiscount })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
