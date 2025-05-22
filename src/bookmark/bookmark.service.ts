import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }

    async getBookmarks(userId: number) {
        try {
            // get all bookmarks
            const bookmarks = await this.prisma.bookmark.findMany({
                where: {
                    userId
                }
            })
            // return the bookmarks
            return bookmarks;
        } catch (error) {
            // handle error
            console.error('Error fetching bookmarks:', error);
            throw new Error('Error fetching bookmarks');
        }
    }

    async createBookmark(dto: BookmarkDto, userId: number) {
        try {
            // create bookmark
            const newBookmark = await this.prisma.bookmark.create({
                data: {
                    userId,
                    title: dto.title,
                    description: dto.description,
                    link: dto.link
                }
            })
            // return the created bookmark
            return { message: 'Bookmark created successfully', bookmark: newBookmark };
        } catch (error) {
            // handle error
            return { message: 'Error creating bookmark', error };
        }

    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        try {
            // get bookmark by id
            const bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId,
                    userId
                }
            })
            return bookmark;
        } catch (error) {
            // handle error
            console.error('Error fetching bookmark:', error);
            throw new Error('Error fetching bookmark');
        }
    }

    async editBookmark(dto: BookmarkDto, userId: number, bookmarkId: number) {
        // edit bookmark
        try {
            const bookmark = await this.prisma.bookmark.update({
            where: {
                id: bookmarkId,
                userId
            },
            data: {
                title: dto.title,
                description: dto.description,
                link: dto.link
            }
        })
        return bookmark;
        } catch (error) {
            // handle error
            console.error('Error editing bookmark:', error);
            throw new Error('Error editing bookmark');
        }
    }

    deleteBookmark(userId: number, bookmarkId: number) {
        // delete bookmark
        try {
            const bookmark = this.prisma.bookmark.delete({
                where: {
                    id: bookmarkId,
                    userId
                }
            })
            return bookmark;
        } catch (err) {
            // handle error
            console.error('Error deleting bookmark:', err);
            throw new Error('Error deleting bookmark');
        }
    }
}
