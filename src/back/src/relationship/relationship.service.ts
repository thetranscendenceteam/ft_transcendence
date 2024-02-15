import { Injectable } from '@nestjs/common';
import { UsersRelationships } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RelationshipForUser } from './dto/RelationshipForUser.entity';

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
            return this.mapUser(userId, res);
        }
        catch (e) {
            console.log("Error on getUserRelationship query");
            throw e;
        }
    }

    async mapUser(userId: string, input: UsersRelationships[]) {
        let res: RelationshipForUser[] = [];
        input.forEach(r => {
            let t = new RelationshipForUser();
            t.userId = userId;
            if (r.firstId != userId) t.relationId = r.firstId;
            else t.relationId = r.secondId;
            t.status = r.status;
            t.createdAt = r.createdAt;
            t.updatedAt = r.updatedAt;
            res.push(t);
        });
        return res;
    }

}
