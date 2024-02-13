import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transaction } from '../../domain/model/transaction.model';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Model, ObjectId, now } from 'mongoose';
import { Status } from '@app/common/constants/constants';

@Schema({ timestamps: true })
export class TransactionDb {
  _id: ObjectId;
  @Prop()
  accountExternalIdDebit: string;

  @Prop()
  accountExternalIdCredit: string;

  @Prop()
  status: string;

  @Prop()
  transactionTypeId: number;

  @Prop()
  amount: number;
  @Prop({ default: now() })
  createdAt: Date;
  @Prop({ default: now() })
  updatedAt: Date;

  static getClassName() {
    return 'Transaction';
  }
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDb);

export class TransactionMongoRepository implements TransactionRepository {
  constructor(
    @InjectModel(TransactionDb.getClassName())
    private transactionModel: Model<TransactionDb>,
  ) {}
  save(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Transaction | undefined> {
    const transactionDb = await this.transactionModel.findById(id);

    if (transactionDb) {
      return this.toModel(transactionDb);
    }
    return;
  }

  toModel(transactionDb: TransactionDb): Transaction {
    return {
      id: transactionDb._id.toString(),
      accountExternalIdDebit: transactionDb.accountExternalIdDebit,
      accountExternalIdCredit: transactionDb.accountExternalIdCredit,
      transactionTypeId: transactionDb.transactionTypeId,
      status: transactionDb.status as Status,
      amount: transactionDb.amount,
      createdAt: transactionDb.createdAt,
    };
  }
}
