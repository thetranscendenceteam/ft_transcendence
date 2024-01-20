import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const Obiwan = await prisma.users.create({
        data: {
            id: 'kenobiObiwan',
            ftid: 1010,
            pseudo: 'highground',
            mail: 'yoda@gmail.com',
            password: 'kekw',
            firstname: 'Obiwan',
            lastname: 'Kenobi',
            avatar: 'Anakin',
        }
    })

    const Anakin = await prisma.users.create({
        data: {
            id: 'anakinSkywalker',
            ftid: 1011,
            pseudo: 'vador',
            mail: 'obiwan@gmail.com',
            password: 'wkek',
            firstname: 'Anakin',
            lastname: 'Skywalker',
            avatar: 'Obiwan'
        }
    })

    const Yoda = await prisma.users.create({
        data: {
            id: 'yoda',
            ftid: 1111,
            pseudo: 'small',
            mail: 'green@gmail.com',
            password: 'saber',
            firstname: 'Yoda',
            lastname: 'dontKnow',
            avatar: 'dasdawda'
        },
    })

    //--------------------------------------------------------------

    const Groupe = await prisma.chats.create({
        data: {
            id: '901918471',
            name: 'conseil',
            password: 'jhsfga'
        },
    })

    const Groupe2 = await prisma.chats.create({
        data: {
            id: '824763520',
            name: 'discord',
            password: 'aigjaiojgsa'
        },
    })

    //--------------------------------------------------------------

    const relation1 = await prisma.usersinchats.create({
        data: {
            userid: 'yoda',
            chatid: '901918471',
            role: owner,
            status: normal
        },
    })

    const relation2 = await prisma.usersinchats.create({
        data: {
            userid: 'anakinSkywalker',
            chatid: '901918471',
            role: member,
            status: muted
        },
    })

    const relation3 = await prisma.usersinchats.create({
        data: {
            userid: 'anakinSkywalker',
            chatid: '824763520',
            role: owner,
            status: normal
        },
    })

    const relation4 = await prisma.usersinchats.create({
        data: {
            userid: 'kenobiObiwan',
            chatid: '824763520',
            role: admin,
            status: normal
        },
    })

    const relation5 = await prisma.usersinchats.create({
        data: {
            userid: 'yoda',
            chatid: '824763520',
            role: member,
            status: banned
        },
    })

    //--------------------------------------------------------------

    console.log({
        Obiwan,
        Anakin,
        Yoda,
        Groupe,
        Groupe2,
        relation1,
        relation2,
        relation3,
        relation4,
        relation5
    })
}

//--------------------------------------------------------------

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })