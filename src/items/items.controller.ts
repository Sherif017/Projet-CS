import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { CreateItemDto } from './dto/create-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  // GET /items?search=...&offset=0&limit=50
  @Get()
  list(@Query('search') search?: string,
       @Query('offset') offset = 0,
       @Query('limit') limit = 50) {
    return this.service.list(search, Number(offset), Number(limit));
  }

  // GET /items/:id
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  // PUT /items/:id  body: { favorite: boolean }
  @Put(':id')
  updateFavorite(@Param('id') id: string, @Body() body: UpdateFavoriteDto) {
    return this.service.updateFavorite(id, body);
  }

  // POST /items
  @Post()
  create(@Body() body: CreateItemDto) {
    return this.service.create(body);
  }
}
