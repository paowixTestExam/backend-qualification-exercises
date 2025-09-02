// ObjectId.ts
import crypto from 'crypto';

export class ObjectId {
  private static RANDOM = crypto.randomBytes(4); 
  private static COUNTER = crypto.randomBytes(3).readUIntBE(0, 3);

  private buffer: Buffer;

  private constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  static generate(type: number = 0x00): ObjectId {
    if (type < 0 || type > 0xff) {
      throw new RangeError('Type must be a 1 byte value (0–255)');
    }

    const buffer = Buffer.alloc(14);

    buffer.writeUInt8(type, 0);

    const timestamp = Date.now();
    buffer.writeUIntBE(timestamp, 1, 6);

    ObjectId.RANDOM.copy(buffer, 7);

    ObjectId.COUNTER = (ObjectId.COUNTER + 1) & 0xffffff;
    buffer.writeUIntBE(ObjectId.COUNTER, 11, 3);

    return new ObjectId(buffer);
  }

  toString(): string {
    return this.buffer.toString('hex');
  }
}
