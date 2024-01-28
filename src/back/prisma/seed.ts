import { PrismaClient, RelationshipStatus, UserChatRole, UserChatStatus } from '@prisma/client'
import { get } from 'http'
const prisma = new PrismaClient()
async function main() {
    const Obiwan = await prisma.users.create({
        data: {
            id: 'kenobiObiwan',
            ftId: 1010,
            pseudo: 'highground',
            mail: 'yoda@gmail.com',
            password: 'kekw',
            firstName: 'Obiwan',
            lastName: 'Kenobi',
            avatar: 'Anakin',
        }
    })

    const Anakin = await prisma.users.create({
        data: {
            id: 'anakinSkywalker',
            ftId: 1011,
            pseudo: 'vador',
            mail: 'obiwan@gmail.com',
            password: 'wkek',
            firstName: 'Anakin',
            lastName: 'Skywalker',
            avatar: 'Obiwan'
        }
    })

    const Yoda = await prisma.users.create({
        data: {
            id: 'yoda',
            ftId: 1111,
            pseudo: 'small',
            mail: 'green@gmail.com',
            password: 'saber',
            firstName: 'Yoda',
            lastName: 'dontKnow',
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

    const relation1 = await prisma.usersInChats.create({
        data: {
            userId: 'yoda',
            chatId: '901918471',
            role: UserChatRole.owner,
            status: UserChatStatus.normal
        },
    })

    const relation2 = await prisma.usersInChats.create({
        data: {
            userId: 'anakinSkywalker',
            chatId: '901918471',
            role: UserChatRole.member,
            status: UserChatStatus.muted
        },

    })

    const relation3 = await prisma.usersInChats.create({
        data: {
            userId: 'anakinSkywalker',
            chatId: '824763520',
            role: UserChatRole.owner,
            status: UserChatStatus.normal
        },
    })

    const relation4 = await prisma.usersInChats.create({
        data: {
            userId: 'kenobiObiwan',
            chatId: '824763520',
            role: UserChatRole.admin,
            status: UserChatStatus.normal
        },
    })

    const relation5 = await prisma.usersInChats.create({
        data: {
            userId: 'yoda',
            chatId: '824763520',
            role: UserChatRole.member,
            status: UserChatStatus.banned
        },
    })

    const relationshipObiwanYoda = await prisma.usersRelationships.create({
        data: {
            firstId: 1010,
            secondId: 1111,
            status: RelationshipStatus.friends
        },
    })

    const relationshipAnakinObiwan = await prisma.usersRelationships.create({
        data: {
            firstId: 1010,
            secondId: 1011,
            status: RelationshipStatus.block_second_to_first
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
        relation5,
        relationshipObiwanYoda,
        relationshipAnakinObiwan
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