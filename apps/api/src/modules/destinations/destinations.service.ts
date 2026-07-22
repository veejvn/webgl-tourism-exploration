import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DestinationDTO } from '@project/types';

@Injectable()
export class DestinationsService {
  constructor(
    @Inject('PRISMA_SERVICE') private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<DestinationDTO[]> {
    const destinations = await this.prisma.destination.findMany({
      include: {
        landmarks: true,
      },
    });
    return destinations;
  }

  async findOne(id: string): Promise<DestinationDTO | null> {
    const destination = await this.prisma.destination.findUnique({
      where: { id },
      include: {
        landmarks: true,
      },
    });
    if (!destination) return null;
    return destination;
  }
}
