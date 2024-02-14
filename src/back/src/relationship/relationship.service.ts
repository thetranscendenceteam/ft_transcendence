import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RelationshipService {
    constructor(private prisma: PrismaService) { }

    async getUserRelationship(userId: string) {
        try {
            const res = await this.prisma.usersRelationships.findMany({
                where: {
                    OR: [
                        { firstId: userId },
                        { secondId: userId },
                    ],
                },
            });
            return
        }
        catch (e) {
            console.log("Error on getUserRelationship query");
            throw e;
        }
    }

}
