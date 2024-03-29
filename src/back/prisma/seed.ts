import { PrismaClient, UserChatRole, UserChatStatus, RelationshipStatus, MatchDifficulty } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const Obiwan = await prisma.users.upsert({
        where: {
            id: 'kenobiObiwan',
        },
        update: {},
        create: {
            id: 'kenobiObiwan',
            ftId: 1010,
            pseudo: 'highground',
            mail: 'yoda@gmail.com',
            password: 'kekw',
            firstName: 'Obiwan',
            lastName: 'Kenobi',
            avatar: 'https://lumiere-a.akamaihd.net/v1/images/62bf0e03e8459d0001f4881b-image_71900d89.jpeg?region=192%2C0%2C1152%2C864',
            campus: 'Coruscant',
            twoFA: true,
        }
    })

    const Anakin = await prisma.users.upsert({
        where: {
            id: 'anakinSkywalker',
        },
        update: {},
        create: {
            id: 'anakinSkywalker',
            ftId: 1011,
            pseudo: 'vador',
            mail: 'obiwan@gmail.com',
            password: 'wkek',
            firstName: 'Anakin',
            lastName: 'Skywalker',
            avatar: 'https://static.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png/revision/latest?cb=20130621175844',
            campus: 'Tatooine',
        }
    })

    const Yoda = await prisma.users.upsert({
        where: {
            id: 'yoda',
        },
        update: {},
        create: {
            id: 'yoda',
            ftId: 1111,
            pseudo: 'small',
            mail: 'green@gmail.com',
            password: 'saber',
            firstName: 'Yoda',
            lastName: 'dontKnow',
            avatar: 'https://lumiere-a.akamaihd.net/v1/images/image_3e7881c8.jpeg?region=131,0,1338,753',
            campus: 'Dagobah',
        },
    })

    //--------------------------------------------------------------

    const Groupe = await prisma.chats.upsert({
        where: {
            id: '901918471',
        },
        update: {},
        create: {
            id: '901918471',
            name: 'conseil',
            isPrivate: true,
        },
    })

    const Groupe2 = await prisma.chats.upsert({
        where: {
            id: '824763520',
        },
        update: {},
        create: {
            id: '824763520',
            name: 'discord',
        },
    })

    //--------------------------------------------------------------

    const relation1 = await prisma.usersInChats.upsert({
        where: {
            userId_chatId: {
                userId: 'yoda',
                chatId: '901918471',
            }
        },
        update: {},
        create: {
            userId: 'yoda',
            chatId: '901918471',
            role: UserChatRole.admin,
        },
    })

    const relation2 = await prisma.usersInChats.upsert({
        where: {
            userId_chatId: {
                userId: 'anakinSkywalker',
                chatId: '901918471',
            }
        },
        update: {},
        create: {
            userId: 'anakinSkywalker',
            chatId: '901918471',
            role: UserChatRole.member,
        },

    })

    const relation3 = await prisma.usersInChats.upsert({
        where: {
            userId_chatId: {
                userId: 'anakinSkywalker',
                chatId: '824763520',
            }
        },
        update: {},
        create: {
            userId: 'anakinSkywalker',
            chatId: '824763520',
            role: UserChatRole.owner,
        },
    })

    const relation4 = await prisma.usersInChats.upsert({
        where: {
            userId_chatId: {
                userId: 'kenobiObiwan',
                chatId: '824763520',
            }
        },
        update: {},
        create: {
            userId: 'kenobiObiwan',
            chatId: '824763520',
            role: UserChatRole.admin,
        },
    })

    const relation5 = await prisma.usersInChats.upsert({
        where: {
            userId_chatId: {
                userId: 'yoda',
                chatId: '824763520',
            }
        },
        update: {},
        create: {
            userId: 'yoda',
            chatId: '824763520',
            role: UserChatRole.member,
        },
    })

    // -----------------------------------------------------------

    const relationshipObiwanYoda = await prisma.usersRelationships.upsert({
        where: {
            id: '39108715'
        },
        update: {},
        create: {
            id: '39108715',
            firstId: 'kenobiObiwan',
            secondId: 'yoda',
            status: RelationshipStatus.friends
        },
    })

    const relationshipAnakinObiwan = await prisma.usersRelationships.upsert({
        where: {
            id: '3901851751'
        },
        update: {},
        create: {
            id: '3901851751',
            firstId: 'anakinSkywalker',
            secondId: 'kenobiObiwan',
            status: RelationshipStatus.block_second_to_first
        },
    })

    // ---------------------------------------------------------------

    const match1 = await prisma.matchs.upsert({
        where: {
            id: '95872389572'
        },
        update: {
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
        },
        create: {
            id: '95872389572',
            difficulty: MatchDifficulty.easy,
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
        }
    })

    const match2 = await prisma.matchs.upsert({
        where: {
            id: '34091858917',
        },
        update: {
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
        },
        create: {
            id: '34091858917',
            difficulty: MatchDifficulty.normal,
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
        }
    })
    // ----------------------------------------------------------------

    const score1 = await prisma.matchScore.upsert({
        where: {
            matchId: '95872389572',
        },
        update: {},
        create: {
            winnerScore: 10,
            looserScore: 8,
            matchId: '95872389572',
            bestOf: 3,
        }
    })

    const score2 = await prisma.matchScore.upsert({
        where: {
            matchId: '34091858917',
        },
        update: {},
        create: {
            winnerScore: 15,
            looserScore: 2,
            matchId: '34091858917',
            bestOf: 7,
        }
    })

    // ----------------------------------------------------------

    const UserInMatch1 = await prisma.usersInMatchs.upsert({
        where: {
            userId_matchId: {
                userId: 'kenobiObiwan',
                matchId: '95872389572'
            },
        },
        update: {},
        create: {
            userId: 'kenobiObiwan',
            matchId: '95872389572',
            isWin: false
        }
    })

    const UserInMatch2 = await prisma.usersInMatchs.upsert({
        where: {
            userId_matchId: {
                userId: 'anakinSkywalker',
                matchId: '95872389572'
            },
        },
        update: {},
        create: {
            userId: 'anakinSkywalker',
            matchId: '95872389572',
            isWin: true
        }
    })

    const UserInMatch3 = await prisma.usersInMatchs.upsert({
        where: {
            userId_matchId: {
                userId: 'anakinSkywalker',
                matchId: '34091858917'
            },
        },
        update: {},
        create: {
            userId: 'anakinSkywalker',
            matchId: '34091858917',
            isWin: false
        }
    })

    const UserInMatch4 = await prisma.usersInMatchs.upsert({
        where: {
            userId_matchId: {
                userId: 'yoda',
                matchId: '34091858917'
            },
        },
        update: {},
        create: {
            userId: 'yoda',
            matchId: '34091858917',
            isWin: true
        }
    })

    // --------------------------------------------------

    const addUserInBanList = await prisma.usersInBanLists.upsert({
        where: {
            userId_chatId: {
                chatId: '824763520',
                userId: 'yoda',
            },
        },
        update: {},
        create: {
            chatId: '824763520',
            userId: 'yoda',
            status: UserChatStatus.banned,
            lastChange: new Date().toISOString(),
        }
    })

    const addUserInBanList2 = await prisma.usersInBanLists.upsert({
        where: {
            userId_chatId: {
                chatId: '824763520',
                userId: 'anakinSkywalker',
            },
        },
        update: {},
        create: {
            chatId: '824763520',
            userId: 'anakinSkywalker',
            status: UserChatStatus.muted,
            lastChange: new Date().toISOString(),
        }
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
        relationshipAnakinObiwan,
        match1,
        match2,
        score1,
        score2,
        UserInMatch1,
        UserInMatch2,
        UserInMatch3,
        UserInMatch4,
        addUserInBanList,
        addUserInBanList2
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