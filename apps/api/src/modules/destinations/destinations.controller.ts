import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationDTO } from '@project/types';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get()
  async findAll(): Promise<DestinationDTO[]> {
    return this.destinationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DestinationDTO> {
    const destination = await this.destinationsService.findOne(id);
    if (!destination) {
      throw new NotFoundException(`Destination with ID ${id} not found`);
    }
    return destination;
  }
}
