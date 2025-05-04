import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateAssignmentDto) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }
}
