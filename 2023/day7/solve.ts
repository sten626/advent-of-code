import { readFileSync } from 'fs';
import { enumerate, range } from '../../shared';

enum HandType {
  'Five of a kind' = 7,
  'Four of a kind' = 6,
  'Full house' = 5,
  'Three of a kind' = 4,
  'Two pair' = 3,
  'One pair' = 2,
  'High card' = 1,
}

const cardMap = new Map([
  ['2', 2],
  ['3', 3],
  ['4', 4],
  ['5', 5],
  ['6', 6],
  ['7', 7],
  ['8', 8],
  ['9', 9],
  ['T', 10],
  ['J', 11],
  ['Q', 12],
  ['K', 13],
  ['A', 14],
]);

class Hand {
  handType = HandType['High card'];

  constructor(
    protected cards: string,
    private _bid: number,
  ) {
    const counter = new Map<string, number>();

    for (const card of cards) {
      const count = counter.get(card) || 0;
      counter.set(card, count + 1);
    }

    this.categorize(counter);
  }

  get bid(): number {
    return this._bid;
  }

  cardValue(i: number): number {
    const cardValue = cardMap.get(this.cards[i]);

    if (cardValue === undefined) {
      throw new Error(`Unknown card: ${this.cards[i]}`);
    }

    return cardValue;
  }

  protected categorize(counter: Map<string, number>) {
    let sawThree = false;
    let sawPair = false;

    for (const count of counter.values()) {
      switch (count) {
        case 5: {
          this.handType = HandType['Five of a kind'];
          return;
        }
        case 4: {
          this.handType = HandType['Four of a kind'];
          return;
        }
        case 3: {
          if (sawPair) {
            this.handType = HandType['Full house'];
            return;
          }

          sawThree = true;
          break;
        }
        case 2: {
          if (sawThree) {
            this.handType = HandType['Full house'];
            return;
          }

          if (sawPair) {
            this.handType = HandType['Two pair'];
            return;
          }

          sawPair = true;
          break;
        }
        case 1: {
          break;
        }
        default: {
          throw new Error(`Unexpected count ${count}`);
        }
      }
    }

    if (sawThree) {
      this.handType = HandType['Three of a kind'];
      return;
    }

    if (sawPair) {
      this.handType = HandType['One pair'];
      return;
    }

    this.handType = HandType['High card'];
  }
}

class Part2Hand extends Hand {
  cardValue(i: number): number {
    const card = this.cards[i];

    if (card === 'J') {
      return 1;
    }

    const cardValue = cardMap.get(card);

    if (cardValue === undefined) {
      throw new Error(`Unknown card: ${card}`);
    }

    return cardValue;
  }

  protected categorize(counter: Map<string, number>) {
    let sawFour = false;
    let sawThree = false;
    let sawPair = false;
    let sawSecondPair = false;
    const numJokers = counter.get('J') || 0;

    for (const [card, count] of counter) {
      if (card === 'J') {
        if (count === 5) {
          this.handType = HandType['Five of a kind'];
          return;
        }

        continue;
      }

      switch (count) {
        case 5: {
          this.handType = HandType['Five of a kind'];
          return;
        }
        case 4: {
          sawFour = true;
          break;
        }
        case 3: {
          sawThree = true;
          break;
        }
        case 2: {
          if (sawPair) {
            sawSecondPair = true;
            break;
          }

          sawPair = true;
          break;
        }
        case 1: {
          break;
        }
        default: {
          throw new Error(`Unexpected count ${count}`);
        }
      }
    }

    if (sawFour) {
      this.handType = HandType['Four of a kind'];
    } else if (sawThree) {
      if (sawPair) {
        this.handType = HandType['Full house'];
      } else {
        this.handType = HandType['Three of a kind'];
      }
    } else if (sawPair) {
      if (sawSecondPair) {
        this.handType = HandType['Two pair'];
      } else {
        this.handType = HandType['One pair'];
      }
    } else {
      this.handType = HandType['High card'];
    }

    switch (+this.handType) {
      case HandType['Four of a kind']: {
        if (numJokers === 1) {
          this.handType = HandType['Five of a kind'];
        }
        break;
      }
      case HandType['Three of a kind']: {
        if (numJokers === 2) {
          this.handType = HandType['Five of a kind'];
        } else if (numJokers === 1) {
          this.handType = HandType['Four of a kind'];
        }
        break;
      }
      case HandType['Two pair']: {
        if (numJokers === 1) {
          this.handType = HandType['Full house'];
        }
        break;
      }
      case HandType['One pair']: {
        if (numJokers === 3) {
          this.handType = HandType['Five of a kind'];
        } else if (numJokers === 2) {
          this.handType = HandType['Four of a kind'];
        } else if (numJokers === 1) {
          this.handType = HandType['Three of a kind'];
        }
        break;
      }
      case HandType['High card']: {
        if (numJokers === 4) {
          this.handType = HandType['Five of a kind'];
        } else if (numJokers === 3) {
          this.handType = HandType['Four of a kind'];
        } else if (numJokers === 2) {
          this.handType = HandType['Three of a kind'];
        } else if (numJokers === 1) {
          this.handType = HandType['One pair'];
        }
        break;
      }
    }
  }
}

function compareHands(a: Hand, b: Hand): number {
  const handCompare = a.handType - b.handType;

  if (handCompare !== 0) {
    return handCompare;
  }

  for (const i of range(5)) {
    const cardCompare = a.cardValue(i) - b.cardValue(i);

    if (cardCompare !== 0) {
      return cardCompare;
    }
  }

  return 0;
}

function main(inputFilename: string) {
  const input = readFileSync(inputFilename, { encoding: 'utf-8' }).trim();
  let hands = part1Hands(input);
  processHands(hands);
  hands = part2Hands(input);
  processHands(hands);
}

function part1Hands(input: string): Hand[] {
  const hands = input
    .split('\n')
    .map((line) => line.split(' '))
    .map(([cards, bid]) => new Hand(cards, Number.parseInt(bid)));

  return hands;
}

function part2Hands(input: string): Hand[] {
  const hands = input
    .split('\n')
    .map((line) => line.split(' '))
    .map(([cards, bid]) => new Part2Hand(cards, Number.parseInt(bid)));

  return hands;
}

function processHands(hands: Hand[]) {
  hands.sort(compareHands);
  let winnings = 0;

  for (const [i, hand] of enumerate(hands)) {
    winnings += hand.bid * (i + 1);
  }

  console.log(winnings);
}

main(process.argv[2]);
