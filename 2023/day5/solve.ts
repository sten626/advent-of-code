import { readFileSync } from 'fs';

const mapNumbersRegex = /(\d+) (\d+) (\d+)/;
const seedsRegex = /seeds: ((\d+\s*)+)/;

type Mapping = [number, number, number];
type Range = [number, number];

class AlmanacMap {
  private maps: Mapping[] = [];

  constructor() {}

  addMapping(mapping: Mapping) {
    this.maps.push(mapping);
  }

  convert(source: number): number {
    for (const [destStart, sourceStart, rangeLength] of this.maps) {
      const sourceEnd = sourceStart + rangeLength - 1;

      if (source >= sourceStart && source <= sourceEnd) {
        return destStart + source - sourceStart;
      }
    }

    return source;
  }

  convertRange(source: Range[]): Range[] {
    const queue = [...source];
    const result: Range[] = [];

    while (queue.length > 0) {
      const [source, sourceRangeLength] = queue.shift() as Range;
      const endSeed = source + sourceRangeLength - 1;
      let processed = false;

      for (const [destStart, sourceStart, mapRangeLength] of this.maps) {
        const sourceEnd = sourceStart + mapRangeLength - 1;

        // Start of seeds is in range.
        if (source >= sourceStart && source <= sourceEnd) {
          if (endSeed >= sourceStart && endSeed <= sourceEnd) {
            // End of seeds is also in range.
            result.push([destStart + source - sourceStart, sourceRangeLength]);
            processed = true;
            break;
          } else {
            // End of seeds is outside of the range.
            const inRangeLength = sourceEnd - source + 1;
            result.push([destStart + source - sourceStart, inRangeLength]);
            queue.push([sourceEnd + 1, sourceRangeLength - inRangeLength]);
            processed = true;
            break;
          }
        } else if (endSeed >= sourceStart && endSeed <= sourceEnd) {
          // Start seed out of range but end seed is in the range.
          const inRangeLength = endSeed - sourceStart + 1;
          result.push([destStart, inRangeLength]);
          queue.push([source, sourceRangeLength - inRangeLength]);
          processed = true;
          break;
        }
      }

      if (processed) {
        continue;
      }

      // Range didn't match any mappings.
      result.push([source, sourceRangeLength]);
    }

    return result;
  }
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  part1(input);
  part2(input);
}

function part1(input: string) {
  const lines = input.split('\n');
  let seeds: number[] = [];
  const seedToSoil = new AlmanacMap();
  const soilToFertilizer = new AlmanacMap();
  const fertilizerToWater = new AlmanacMap();
  const waterToLight = new AlmanacMap();
  const lightToTemperature = new AlmanacMap();
  const temperatureToHumidity = new AlmanacMap();
  const humidityToLocation = new AlmanacMap();
  let currentMap = seedToSoil;

  for (const line of lines) {
    if (line === '') {
      continue;
    }

    const seedsMatch = line.match(seedsRegex);

    if (seedsMatch) {
      seeds = seedsMatch[1].split(' ').map((n) => Number.parseInt(n));
      continue;
    }

    const mapNumbersMatch = line.match(mapNumbersRegex);

    if (mapNumbersMatch) {
      const destStart = Number.parseInt(mapNumbersMatch[1]);
      const sourceStart = Number.parseInt(mapNumbersMatch[2]);
      const rangeLength = Number.parseInt(mapNumbersMatch[3]);
      currentMap.addMapping([destStart, sourceStart, rangeLength]);
      continue;
    }

    switch (line) {
      case 'seed-to-soil map:': {
        currentMap = seedToSoil;
        continue;
      }
      case 'soil-to-fertilizer map:': {
        currentMap = soilToFertilizer;
        continue;
      }
      case 'fertilizer-to-water map:': {
        currentMap = fertilizerToWater;
        continue;
      }
      case 'water-to-light map:': {
        currentMap = waterToLight;
        continue;
      }
      case 'light-to-temperature map:': {
        currentMap = lightToTemperature;
        continue;
      }
      case 'temperature-to-humidity map:': {
        currentMap = temperatureToHumidity;
        continue;
      }
      case 'humidity-to-location map:': {
        currentMap = humidityToLocation;
        continue;
      }
      default: {
        throw new Error(`Unhandled line: ${line}`);
      }
    }
  }

  const soils = seeds.map((seed) => seedToSoil.convert(seed));
  const fertilizers = soils.map((soil) => soilToFertilizer.convert(soil));
  const waters = fertilizers.map((f) => fertilizerToWater.convert(f));
  const lights = waters.map((w) => waterToLight.convert(w));
  const temperatures = lights.map((l) => lightToTemperature.convert(l));
  const humidities = temperatures.map((t) => temperatureToHumidity.convert(t));
  const locations = humidities.map((h) => humidityToLocation.convert(h));
  const minLocation = Math.min(...locations);

  console.log(minLocation);
}

function part2(input: string) {
  const lines = input.split('\n');
  const seeds: Range[] = [];
  const seedToSoil = new AlmanacMap();
  const soilToFertilizer = new AlmanacMap();
  const fertilizerToWater = new AlmanacMap();
  const waterToLight = new AlmanacMap();
  const lightToTemperature = new AlmanacMap();
  const temperatureToHumidity = new AlmanacMap();
  const humidityToLocation = new AlmanacMap();
  let currentMap = seedToSoil;

  for (const line of lines) {
    if (line === '') {
      continue;
    }

    const seedsMatch = line.match(seedsRegex);

    if (seedsMatch) {
      const temp = seedsMatch[1].split(' ').map((n) => Number.parseInt(n));

      while (temp.length > 0) {
        const seed = temp.shift();
        const length = temp.shift();

        if (seed === undefined || length === undefined) {
          throw new Error('Failure parsing seeds.');
        }

        seeds.push([seed, length]);
      }

      continue;
    }

    const mapNumbersMatch = line.match(mapNumbersRegex);

    if (mapNumbersMatch) {
      const destStart = Number.parseInt(mapNumbersMatch[1]);
      const sourceStart = Number.parseInt(mapNumbersMatch[2]);
      const rangeLength = Number.parseInt(mapNumbersMatch[3]);
      currentMap.addMapping([destStart, sourceStart, rangeLength]);
      continue;
    }

    switch (line) {
      case 'seed-to-soil map:': {
        currentMap = seedToSoil;
        continue;
      }
      case 'soil-to-fertilizer map:': {
        currentMap = soilToFertilizer;
        continue;
      }
      case 'fertilizer-to-water map:': {
        currentMap = fertilizerToWater;
        continue;
      }
      case 'water-to-light map:': {
        currentMap = waterToLight;
        continue;
      }
      case 'light-to-temperature map:': {
        currentMap = lightToTemperature;
        continue;
      }
      case 'temperature-to-humidity map:': {
        currentMap = temperatureToHumidity;
        continue;
      }
      case 'humidity-to-location map:': {
        currentMap = humidityToLocation;
        continue;
      }
      default: {
        throw new Error(`Unhandled line: ${line}`);
      }
    }
  }

  const soils = seedToSoil.convertRange(seeds);
  const fertilizers = soilToFertilizer.convertRange(soils);
  const waters = fertilizerToWater.convertRange(fertilizers);
  const lights = waterToLight.convertRange(waters);
  const temperatures = lightToTemperature.convertRange(lights);
  const humidities = temperatureToHumidity.convertRange(temperatures);
  const locations = humidityToLocation.convertRange(humidities);
  const minLocation = Math.min(...locations.map((lRange) => lRange[0]));

  console.log(minLocation);
}

main(process.argv[2]);
