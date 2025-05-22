import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from 'src/auth/decorator';
import { BookmarkDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId);
    }


    @HttpCode(HttpStatus.CREATED)
    @Post()
    createBookmark(@Body() dto: BookmarkDto, @GetUser('id') userId: number) {
        return this.bookmarkService.createBookmark(dto, userId);
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId);
    }

    @Patch('edit/:id')
    editBookmark(@Body() dto: BookmarkDto, @GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.editBookmark(dto, userId, bookmarkId);
    }

    @Delete('delete/:id')
    deleteBookmark(@GetUser('id') userId: number , @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmark(userId, bookmarkId);
    }
}
