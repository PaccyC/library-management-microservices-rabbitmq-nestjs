import { Controller,Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const GET_CUSTOMER = 'getCustomer';


@Controller('customer')
export class CustomerController {

    constructor(
        private readonly customerService: CustomerService
    ){}


    @MessagePattern(GET_CUSTOMER)
    async handleGetCustomer( @Payload() data : {customerId: string}){

        const {customerId}= data
        return this.customerService.getCustomer(customerId)
    }
}
