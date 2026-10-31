import { DestinationsService } from './destinations.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DestinationsService public reads', () => {
  const published = {
    id: 'published',
    title: 'Published destination',
    description: 'Verified description',
    latitude: 10,
    longitude: 105,
    coverImage: 'cover.jpg',
    modelUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    landmarks: [],
  };

  it('lists only destinations that are both verified and published', async () => {
    const findMany = jest.fn().mockImplementation(async (query) =>
      query.where?.verificationStatus === 'VERIFIED' &&
      query.where?.publicationStatus === 'PUBLISHED'
        ? [published]
        : [published, { ...published, id: 'in-review' }],
    );
    const service = new DestinationsService({ destination: { findMany } } as unknown as PrismaService);

    expect(await service.findAll()).toEqual([published]);
  });

  it('resolves published detail but hides in-review detail', async () => {
    const findFirst = jest.fn().mockImplementation(async (query) => {
      if (
        query.where?.verificationStatus !== 'VERIFIED' ||
        query.where?.publicationStatus !== 'PUBLISHED'
      ) return { ...published, id: 'in-review' };
      return query.where.id === 'published' ? published : null;
    });
    const service = new DestinationsService({ destination: { findFirst } } as unknown as PrismaService);

    expect(await service.findOne('published')).toEqual(published);
    expect(await service.findOne('in-review')).toBeNull();
  });
});
