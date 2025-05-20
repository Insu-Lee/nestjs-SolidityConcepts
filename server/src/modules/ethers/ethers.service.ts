import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ethers,
  zeroPadValue,
  encodeBytes32String,
  isBytesLike,
  toUtf8Bytes,
  parseEther,
  LogDescription,
  formatEther,
} from 'ethers';
import { abi, address } from '../../../abis/SolidityConcepts.json';

@Injectable()
export class EthersService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey!, this.provider);
    this.contract = new ethers.Contract(address, abi, this.signer);
  }

  zeroPadValue32(data: string) {
    return zeroPadValue(data, 32);
  }

  encodeBytes32String(data: string) {
    return encodeBytes32String(data);
  }

  isBytesLike(data: string) {
    return isBytesLike(data);
  }

  toUtf8Bytes(data: string) {
    return toUtf8Bytes(data);
  }

  parseEther(data: string) {
    return parseEther(data);
  }

  formatEther(data: bigint) {
    return formatEther(data);
  }

  // 위 코드는 지우지 마세요.

  async owner() {
    // Todo: owner의 값을 리턴합니다.
    return await this.contract.owner();
  }

  async fixedValue() {
    // Todo: FIXED_VALUE의 값을 리턴합니다.
    return await this.contract.FIXED_VALUE();
  }

  async value() {
    // Todo: value의 값을 리턴합니다.
    return await this.contract.value();
  }

  async checkValue(value: number) {
    // Todo: checkValue의 값을 리턴합니다.
    return await this.contract.checkValue(value);
  }

  async sumUpTo(value: number) {
    // Todo: sumUpTo의값을 리턴합니다.
    return await this.contract.sumUpTo(value);
  }

  async updateValue(value: number) {
    const result = {
      oldValue: 0,
      newValue: 0,
    };

    // Todo: updateValue의값을 리턴합니다.
    // ⚠️ ValueChanged 이벤트를 영수증안의 logs 에서 확인(contract.interface.parseLog(log))하여 객체를 리턴합니다.
    /*
      예시 - 리턴 객체
      {
        oldValue: 123,
        newValue: 1
      }
    */

    const tx = await this.contract.updateValue(value);
    const receipt = await tx.wait();

    // console.log(receipt);

    for (const log of receipt.logs) {
      const logDescription = this.contract.interface.parseLog(
        log
      ) as LogDescription;

      // console.log(logDescription);
      if (logDescription.fragment.name === 'ValueChanged') {
        const oldValue = logDescription.args[0];
        const newValue = logDescription.args[1];
        // console.log(oldValue, newValue);
        result.oldValue = oldValue;
        result.newValue = newValue;
      }
    }

    // console.log(result);
    return result;
  }

  async ownerFunction() {
    // Todo: ownerFunction의값을 리턴합니다.

    return await this.contract.ownerFunction();
  }

  async sendEther(address: string, value: number) {
    // Todo: sendEther의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)

    const tx = await this.contract.sendEther(address, {
      value: this.parseEther(value.toString()),
    });
    const receipt = await tx.wait();

    return receipt;
  }

  async getContractBalance() {
    // Todo: getContractBalance의 값을 리턴합니다.
    // ⚠️ 리턴은 ether 단위로 리턴합니다.(wei => ether)

    const lawBalance = await this.contract.getContractBalance();

    // console.log(this.formatEther(lawBalance));
    return this.formatEther(lawBalance);
  }

  async deposit(value: number) {
    // Todo: Contract에 코인을 전송합니다. (컨트랙트에 직접 코인을 전송해야함)
    // ⚠️ tx 확정 후 영수증을 리턴합니다.(wait)

    const tx = await this.signer.sendTransaction({
      to: this.contract.target,
      value: this.parseEther(value.toString()),
    });
    const receipt = await tx.wait();
    return receipt;
  }

  async withDraw() {
    // Todo: withDraw의값을 리턴합니다.
    // ⚠️ setter함수는 tx 확정 후 영수증을 리턴합니다.(wait)

    const tx = await this.contract.withDraw();
    const receipt = await tx.wait();
    return receipt;
  }
}
