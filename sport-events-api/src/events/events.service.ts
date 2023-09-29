import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  async findAll(): Promise<any> {
    const events = await this.eventsRepository.find();
    return {
      type: 'success',
      message: 'Events updated',
      status: HttpStatus.OK,
      data: events,
      notifyUser: true,
    };
  }

  /**
   * Find one event by id and return it as an event object
   * @param id The id of the event to find
   * @returns The event object as an event object
   * @throws {HttpException} If the event is not found
   * @throws {Error} If the event could not be retrieved
   */
  async findOne(id: string): Promise<any> {
    const event = await this.eventsRepository.findOne({ where: { id: id } });
    if (!event) {
      throw new HttpException(
        {
          type: 'error',
          message: 'Event not found.',
          status: HttpStatus.NOT_FOUND,
          notifyUser: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      type: 'success',
      message: 'Events updated',
      status: HttpStatus.OK,
      data: event,
      notifyUser: false,
    };
  }

  /**
   * Create a new event object and save it to the database. If the event already exists, throw an error.
   * @param event The event object to create
   * @returns The event object as an event object
   */
  async create(event: Event): Promise<any> {
    let existingEvent = await this.eventsRepository.findOne({
      where: {
        id: event.id,
      },
    });
  
    if (!existingEvent) {
      existingEvent = await this.eventsRepository.findOne({
        where: {
          name: event.name,
        },
      });
  
      if (existingEvent) {
        if (existingEvent.sport !== event.sport) {
          existingEvent = null;
        }
      }
  
      if (existingEvent) {
        if (
          (existingEvent.startTime && existingEvent.startTime !== event.startTime) ||
          (existingEvent.finishTime && existingEvent.finishTime !== event.finishTime)
        ) {
          existingEvent = null;
        } else {
          if (existingEvent.status!== event.status) {
            existingEvent = null;
          }
        }
      }
    }
  
    if (existingEvent) {
      throw new HttpException(
        {
          type: 'error',
          message: 'Event with the given attributes already exists.',
          status: HttpStatus.BAD_REQUEST,
          notifyUser: true,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  
    try {
      const savedEvent = await this.eventsRepository.save(event);
      return {
        type: 'success',
        message: 'Event successfully created.',
        status: HttpStatus.CREATED,
        data: savedEvent,
        notifyUser: true,
      };
    } catch (error) {
      console.error('Failed to save event:', event);
      console.error(error);
      throw new Error('Failed to save event');
    }
  }
  
  /**
   * Remove an event from the database. If the event does not exist, throw an error.
   * @param id The id of the event to remove
   * @returns The event object as an event object
   */
  async remove(id: string): Promise<any> {
    try {
      await this.eventsRepository.delete(id);
      return {
        type: 'success',
        message: 'Event deleted successfully.',
        status: HttpStatus.OK,
        notifyUser: true,
      };
    } catch (error) {
      console.error('Failed to delete event:', id);
      console.error(error);
      throw new HttpException(
        {
          type: 'error',
          message: 'Failed to delete event.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          notifyUser: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing event object and save it to the database. If the event does not exist, throw an error.
   * @param id The id of the event to update
   * @param event The event object to update
   * @returns The updated event object as an event object
   */
  async update(id: string, event: Partial<Event>): Promise<any> {
    const existingEvent = await this.eventsRepository.findOne({
      where: { id: id },
    });
    if (!existingEvent) {
      throw new HttpException(
        {
          type: 'error',
          message: 'Event not found.',
          status: HttpStatus.NOT_FOUND,
          notifyUser: true,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.eventsRepository.update(id, event);
      return {
        type: 'success',
        message: 'Event updated successfully.',
        status: HttpStatus.OK,
        notifyUser: true,
      };
    } catch (error) {
      console.error('Failed to update event:', id);
      console.error(error);
      throw new HttpException(
        {
          type: 'error',
          message: 'Failed to update event.',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          notifyUser: true,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
