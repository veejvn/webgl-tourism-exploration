import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.landmark.deleteMany({});
  await prisma.destination.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared database.');

  // Create Destinations & Landmarks
  const sam = await prisma.destination.create({
    data: {
      id: 'nui-sam',
      title: 'Núi Sam - Bà Chúa Xứ',
      description: 'Trung tâm du lịch tâm linh nổi tiếng bậc nhất miền Tây với Miếu Bà Chúa Xứ, Chùa Tây An và Lăng Tôn Đức Thắng.',
      latitude: 10.7000,
      longitude: 105.1167,
      coverImage: 'https://images.unsplash.com/photo-1555861496-0666c8981751?w=600&auto=format&fit=crop',
      landmarks: {
        create: [
          {
            id: 'ba-chua-xu',
            title: 'Miếu Bà Chúa Xứ',
            description: 'Tượng Bà Chúa Xứ cao 2.7m trên đỉnh núi Sam.',
            latitude: 10.6989,
            longitude: 105.1131,
          },
          {
            id: 'chua-tay-an',
            title: 'Chùa Tây An',
            description: 'Ngôi chùa cổ kính với kiến trúc đặc sắc.',
            latitude: 10.7012,
            longitude: 105.1145,
          }
        ]
      }
    }
  });

  const cam = await prisma.destination.create({
    data: {
      id: 'nui-cam',
      title: 'Núi Cấm',
      description: 'Đỉnh núi cao nhất trong vùng Bảy Núi (710m) với chùa Vạn Linh và tượng Phật Di Lặc khổng lồ.',
      latitude: 10.4667,
      longitude: 105.1833,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
      landmarks: {
        create: [
          {
            id: 'dinh-nui-cam',
            title: 'Đỉnh Núi Cấm',
            description: 'Đỉnh cao 710m với view toàn cảnh.',
            latitude: 10.4689,
            longitude: 105.1856,
          },
          {
            id: 'chua-van-linh',
            title: 'Chùa Vạn Linh',
            description: 'Ngôi chùa lớn trên núi Cấm.',
            latitude: 10.4656,
            longitude: 105.1823,
          }
        ]
      }
    }
  });

  const phutu = await prisma.destination.create({
    data: {
      id: 'hon-phu-tu',
      title: 'Hòn Phụ Tử',
      description: 'Hai hòn đảo đá vôi sừng sững giữa biển Hà Tiên, hình dáng giống người cha bế con.',
      latitude: 10.3833,
      longitude: 104.5500,
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
    }
  });

  const phuquoc = await prisma.destination.create({
    data: {
      id: 'phu-quoc',
      title: 'Phú Quốc',
      description: 'Đảo ngọc với biển Sao trong vắt, cáp treo Hòn Thơm dài nhất thế giới và làng chài Hàm Ninh.',
      latitude: 10.2231,
      longitude: 103.9572,
      coverImage: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&auto=format&fit=crop',
      landmarks: {
        create: [
          {
            id: 'bien-sao',
            title: 'Biển Sao',
            description: 'Bãi biển đẹp nhất Phú Quốc với cát trắng mịn.',
            latitude: 10.2156,
            longitude: 103.9756,
          },
          {
            id: 'cap-treo-hon-thom',
            title: 'Cáp treo Hòn Thơm',
            description: 'Dây cáp treo dài nhất thế giới (8km).',
            latitude: 10.1895,
            longitude: 103.9234,
          }
        ]
      }
    }
  });

  const hatien = await prisma.destination.create({
    data: {
      id: 'ha-tien',
      title: 'Hà Tiên',
      description: 'Vùng đất biên giới với Thập cảnh Hà Tiên, biển Mũi Nai và di tích lịch sử Mạc Cửu.',
      latitude: 10.3833,
      longitude: 104.4833,
      coverImage: 'https://images.unsplash.com/photo-1501436513145-30f24e197862?w=600&auto=format&fit=crop',
      landmarks: {
        create: [
          {
            id: 'mui-nai',
            title: 'Biển Mũi Nai',
            description: 'Bãi biển hoang sơ với tượng cá voi khổng lồ.',
            latitude: 10.3723,
            longitude: 104.4612,
          }
        ]
      }
    }
  });

  const rachgia = await prisma.destination.create({
    data: {
      id: 'rach-gia',
      title: 'Rạch Giá',
      description: 'Trung tâm hành chính tỉnh An Giang với cảng biển sầm uất và khu du lịch Hòn Đất.',
      latitude: 10.0125,
      longitude: 105.0800,
      coverImage: 'https://images.unsplash.com/photo-1516690561799-49d528a6e179?w=600&auto=format&fit=crop',
    }
  });

  const chaudoc = await prisma.destination.create({
    data: {
      id: 'chau-doc',
      title: 'Châu Đốc',
      description: 'Thành phố biên giới với cửa khẩu Vĩnh Xương, làng Chăm văn hóa và rừng tràm Trà Sư.',
      latitude: 10.7000,
      longitude: 105.1167,
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
    }
  });

  const uminhthuong = await prisma.destination.create({
    data: {
      id: 'u-minh-thuong',
      title: 'Khu bảo tồn U Minh Thượng',
      description: 'Vườn quốc gia với hệ sinh thái rừng ngập mặn độc đáo, chim muông phong phú.',
      latitude: 9.9500,
      longitude: 105.0000,
      coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop',
    }
  });

  // Seed a default admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tourism.com',
      password: '$argon2id$v=19$m=65536,t=3,p=4$Y216d2RreHByZGVmZ2hpag$R3hWUTlVTEg2Tnl1Zlp2aGZ3WTRKQXpHWnZZS2F5UEQ',
      name: 'Admin User',
      role: 'ADMIN',
    }
  });

  console.log({ sam, cam, phutu, phuquoc, hatien, rachgia, chaudoc, uminhthuong, admin });
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
