import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as path from 'path';

@Injectable()
export class SqlitePrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const cwd = process.cwd();
    const apiRoot =
      cwd.endsWith('apps/api') || cwd.endsWith('apps\\api')
        ? cwd
        : path.resolve(cwd, 'apps/api');
    const dbPath = path.resolve(
      apiRoot,
      process.env.SQLITE_DATABASE_FILE ?? 'dev.db',
    );
    const adapter = new PrismaBetterSqlite3({
      url: `file:${dbPath}`,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedAnGiangData();
  }

  private async seedAnGiangData() {
    const count = await this.destination.count();
    if (count > 0) return;

    await this.destination.createMany({
      data: [
        {
          id: 'nui-sam',
          title: 'Núi Sam - Bà Chúa Xứ',
          description:
            'Trung tâm du lịch tâm linh nổi tiếng bậc nhất miền Tây với Miếu Bà Chúa Xứ, Chùa Tây An và Lăng Tôn Đức Thắng.',
          latitude: 10.7,
          longitude: 105.1167,
          coverImage:
            'https://images.unsplash.com/photo-1555861496-0666c8981751?w=600&auto=format&fit=crop',
        },
        {
          id: 'nui-cam',
          title: 'Núi Cấm',
          description:
            'Đỉnh núi cao nhất trong vùng Bảy Núi (710m) với chùa Vạn Linh và tượng Phật Di Lặc khổng lồ.',
          latitude: 10.4667,
          longitude: 105.1833,
          coverImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
        },
        {
          id: 'hon-phu-tu',
          title: 'Hòn Phụ Tử',
          description:
            'Hai hòn đảo đá vôi sừng sững giữa biển Hà Tiên, hình dáng giống người cha bế con.',
          latitude: 10.3833,
          longitude: 104.55,
          coverImage:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop',
        },
        {
          id: 'phu-quoc',
          title: 'Phú Quốc',
          description:
            'Đảo ngọc với biển Sao trong vắt, cáp treo Hòn Thơm dài nhất thế giới và làng chài Hàm Ninh.',
          latitude: 10.2231,
          longitude: 103.9572,
          coverImage:
            'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=600&auto=format&fit=crop',
        },
        {
          id: 'ha-tien',
          title: 'Hà Tiên',
          description:
            'Vùng đất biên giới với Thập cảnh Hà Tiên, biển Mũi Nai và di tích lịch sử Mạc Cửu.',
          latitude: 10.3833,
          longitude: 104.4833,
          coverImage:
            'https://images.unsplash.com/photo-1501436513145-30f24e197862?w=600&auto=format&fit=crop',
        },
        {
          id: 'rach-gia',
          title: 'Rạch Giá',
          description:
            'Trung tâm hành chính tỉnh An Giang với cảng biển sầm uất và khu du lịch Hòn Đất.',
          latitude: 10.0125,
          longitude: 105.08,
          coverImage:
            'https://images.unsplash.com/photo-1516690561799-49d528a6e179?w=600&auto=format&fit=crop',
        },
        {
          id: 'chau-doc',
          title: 'Châu Đốc',
          description:
            'Thành phố biên giới với cửa khẩu Vĩnh Xương, làng Chăm văn hóa và rừng tràm Trà Sư.',
          latitude: 10.7,
          longitude: 105.1167,
          coverImage:
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop',
        },
        {
          id: 'u-minh-thuong',
          title: 'Khu bảo tồn U Minh Thượng',
          description:
            'Vườn quốc gia với hệ sinh thái rừng ngập mặn độc đáo, chim muông phong phú.',
          latitude: 9.95,
          longitude: 105.0,
          coverImage:
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&auto=format&fit=crop',
        },
      ],
    });

    await this.landmark.createMany({
      data: [
        {
          id: 'ba-chua-xu',
          destinationId: 'nui-sam',
          title: 'Miếu Bà Chúa Xứ',
          description: 'Tượng Bà Chúa Xứ cao 2.7m trên đỉnh núi Sam.',
          latitude: 10.6989,
          longitude: 105.1131,
        },
        {
          id: 'chua-tay-an',
          destinationId: 'nui-sam',
          title: 'Chùa Tây An',
          description: 'Ngôi chùa cổ kính với kiến trúc đặc sắc.',
          latitude: 10.7012,
          longitude: 105.1145,
        },
        {
          id: 'dinh-nui-cam',
          destinationId: 'nui-cam',
          title: 'Đỉnh Núi Cấm',
          description: 'Đỉnh cao 710m với view toàn cảnh.',
          latitude: 10.4689,
          longitude: 105.1856,
        },
        {
          id: 'chua-van-linh',
          destinationId: 'nui-cam',
          title: 'Chùa Vạn Linh',
          description: 'Ngôi chùa lớn trên núi Cấm.',
          latitude: 10.4656,
          longitude: 105.1823,
        },
        {
          id: 'bien-sao',
          destinationId: 'phu-quoc',
          title: 'Biển Sao',
          description: 'Bãi biển đẹp nhất Phú Quốc với cát trắng mịn.',
          latitude: 10.2156,
          longitude: 103.9756,
        },
        {
          id: 'cap-treo-hon-thom',
          destinationId: 'phu-quoc',
          title: 'Cáp treo Hòn Thơm',
          description: 'Dây cáp treo dài nhất thế giới (8km).',
          latitude: 10.1895,
          longitude: 103.9234,
        },
        {
          id: 'mui-nai',
          destinationId: 'ha-tien',
          title: 'Biển Mũi Nai',
          description: 'Bãi biển hoang sơ với tượng cá voi khổng lồ.',
          latitude: 10.3723,
          longitude: 104.4612,
        },
      ],
    });
  }
}
