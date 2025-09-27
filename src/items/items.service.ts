import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Item } from './types/item.type';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

type Any = Record<string, any>;

function toNumber(n: any): number | undefined {
  const v = Number(n);
  return Number.isFinite(v) ? v : undefined;
}

// extraction robuste lat/lon (selon la forme)
function extractCoords(row: Any): { lat?: number; lon?: number } {
  const lat = toNumber(row.latitude ?? row.lat);
  const lon = toNumber(row.longitude ?? row.lon);
  if (lat !== undefined && lon !== undefined) return { lat, lon };

  const geo = row.position || row.geopoint || row.geo || row.geo_point_2d;
  if (geo && typeof geo === 'object') {
    const lat2 = toNumber(geo.lat ?? geo[0]);
    const lon2 = toNumber(geo.lon ?? geo[1]);
    if (lat2 !== undefined && lon2 !== undefined) return { lat: lat2, lon: lon2 };
  }

  if (typeof row.geo_point_2d === 'string') {
    const m = row.geo_point_2d.match(/(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)/);
    if (m) {
      const a = Number(m[1]), b = Number(m[3]);
      if (a >= -90 && a <= 90 && b >= -180 && b <= 180) return { lat: a, lon: b };
      if (b >= -90 && b <= 90 && a >= -180 && a <= 180) return { lat: b, lon: a };
    }
  }
  return {};
}

@Injectable()
export class ItemsService implements OnModuleInit {
  private items = new Map<string, Item>();

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('OPENDATA_URL');
    if (!url) return;

    const { data } = await axios.get(url);
    // Opendatasoft v2.1 place généralement les enregistrements dans "results"
    const records: Any[] = Array.isArray(data) ? data
                      : Array.isArray(data.results) ? data.results
                      : Array.isArray(data.records) ? data.records
                      : [];

    for (const raw of records) {
      // certains portails mettent les champs dans .fields
      const row = raw?.fields ? { ...raw.fields, id: raw.recordid, ...raw } : raw;

      const coords = extractCoords(row);
      if (coords.lat === undefined || coords.lon === undefined) continue;

      const item: Item = {
        id: String(row.uai ?? row.id ?? row.recordid ?? Math.random()),
        name: String(row.nom_etablissement ?? row.appellation_officielle ?? row.nom ?? 'Établissement'),
        coords: { lat: coords.lat, lon: coords.lon },
        imageUrl: undefined, // pas d'image dans ce dataset
        type: row.type_etablissement ?? row.secteur,
        favorite: false,
        details: row,
      };
      this.items.set(item.id, item);
    }

    console.log(`✅ Items loaded: ${this.items.size}`);
  }

  list(search?: string, offset = 0, limit = 50): Item[] {
    let arr = Array.from(this.items.values());
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.type && i.type.toLowerCase().includes(q))
      );
    }
    return arr.slice(offset, offset + limit).map(({ details, ...summary }) => summary);
  }

  get(id: string): Item {
    const it = this.items.get(id);
    if (!it) throw new NotFoundException('Item not found');
    return it;
  }

  updateFavorite(id: string, dto: UpdateFavoriteDto): Item {
    const it = this.get(id);
    it.favorite = dto.favorite;
    return it;
  }

  create(dto: CreateItemDto): Item {
    if (this.items.has(dto.id)) throw new Error('Duplicate id');
    const it: Item = {
      id: dto.id,
      name: dto.name,
      coords: { lat: dto.latitude, lon: dto.longitude },
      imageUrl: dto.imageUrl,
      type: dto.type,
      favorite: false,
    };
    this.items.set(it.id, it);
    return it;
  }
}
