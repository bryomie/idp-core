import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  private items = [
    { id: 1, name: 'Server-Alpha', status: 'Running' },
    { id: 2, name: 'DB-Prod', status: 'Stopped' },
  ];

  create(createItemDto: CreateItemDto) {
    const newItem = { id: Date.now(), ...createItemDto };
    this.items.push(newItem);
    return newItem;
  }

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    return this.items.find(item => item.id === id);
  }
  
  update(id: number, updateItemDto: UpdateItemDto) { return `Updated #${id}`; }
  remove(id: number) { return `Removed #${id}`; }
}