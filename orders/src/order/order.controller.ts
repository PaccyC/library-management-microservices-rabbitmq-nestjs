import { BadRequestException, Controller, Inject, NotFoundException, Post, ServiceUnavailableException } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/dtos';




const IS_BOOK_IN_STOCK= "isBookInStock"
const GET_BOOK= "getBook"
const GET_CUSTOMER="getCustomer"
const DECREASE_STOCK= "decreaseStock"


@Controller('order')
export class OrderController {

     constructor (
        private readonly orderService: OrderService,
        @Inject("BOOK_SERVICE") private readonly bookClient:ClientProxy,
        @Inject("CUSTOMER_SERVICE") private readonly customerClient:ClientProxy
    ){}


    @Post('/')
    async createOrder(createOrderDto:CreateOrderDto) {
        const { quantity, bookId,customerId}= createOrderDto

        let customer,book;
        try {
            customer= await this.customerClient.send(GET_CUSTOMER,{customerId}).toPromise()
            book= await this.bookClient.send(GET_BOOK,{bookId}).toPromise();

        } catch (error) {
            throw new ServiceUnavailableException("Service not  available, please try again")
        }

        if(!customer) throw new NotFoundException("Customer not found")
        if(!book) throw new NotFoundException("Book not found")

        const isBookInStock= await this.bookClient.send(IS_BOOK_IN_STOCK,{bookId}).toPromise();

        if(!isBookInStock) throw new BadRequestException("Not enough books in stock")

        const order= await this.orderService.createOrder(createOrderDto)

        this.bookClient.emit(DECREASE_STOCK,{book,quantity})
    }


}
