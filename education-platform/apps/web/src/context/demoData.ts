
import {
    Parent, Member, Task, Notification,
} from '@/types/types';
import { addDays } from 'date-fns/addDays';
import { format } from 'date-fns/format';

export const DemoData = () => {

    const today = format(new Date(), 'yyyy-MM-dd');
    const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const dayAfter = format(addDays(new Date(), 2), 'yyyy-MM-dd');

    const DEMO_PARENT: Parent = { id: 'p1', name: 'Nguyễn Văn An', email: 'an@example.com', password: 'parent123' };

    const DEMO_MEMBERS: Member[] = [
        { id: 'm1', name: 'Nguyễn Minh Khoa', gender: 'male', grade: '5', interest: 'Toán', username: 'khoa.m1.child', password: 'An_parent_001', parentId: 'p1' },
        { id: 'm2', name: 'Nguyễn Thu Hà', gender: 'female', grade: '3', interest: 'Tiếng Anh', username: 'ha.m2.child', password: 'An_parent_002', parentId: 'p1' },
    ];

    const DEMO_TASKS: Task[] = [
        {
            id: 't1', title: 'Làm bài tập Toán trang 45', note: 'Làm hết các bài từ 1 đến 5, chú ý phần phân số', date: today, duration: '30 phút',
            assignedTo: ['m1'], files: [], memberStatus: { m1: 'assigned' },
            questions: [
                { id: 'q1', text: '5 × 7 = ?', type: 'multiple_choice', options: ['30', '35', '40', '45'], correctAnswer: '35' },
                { id: 'q2', text: 'Tính diện tích hình chữ nhật có chiều dài 8cm, chiều rộng 5cm?', type: 'short_answer', correctAnswer: '40 cm²' },
                { id: 'q3', text: 'Phân số nào bằng 1/2?', type: 'multiple_choice', options: ['2/3', '3/6', '4/9', '5/8'], correctAnswer: '3/6' },
            ],
            submissions: [], createdAt: new Date().toISOString()
        },
        {
            id: 't2', title: 'Ôn từ vựng Tiếng Anh Unit 5', note: 'Học 20 từ mới, viết câu ví dụ cho mỗi từ', date: today, duration: '20 phút',
            assignedTo: ['m2'], files: [], memberStatus: { m2: 'viewed' },
            questions: [], submissions: [], createdAt: new Date().toISOString()
        },
        {
            id: 't3', title: 'Đọc sách Khoa học tự nhiên chương 3', note: 'Đọc và ghi chú những điều thú vị về hệ mặt trời', date: tomorrow, duration: '45 phút',
            assignedTo: ['m1', 'm2'], files: [], memberStatus: { m1: 'assigned', m2: 'assigned' },
            questions: [], submissions: [], createdAt: new Date().toISOString()
        },
        {
            id: 't4', title: 'Luyện viết chính tả bài 12', note: 'Viết lại 3 lần mỗi từ khó', date: dayAfter, duration: '25 phút',
            assignedTo: ['m2'], files: [], memberStatus: { m2: 'assigned' },
            questions: [], submissions: [], createdAt: new Date().toISOString()
        },
    ];

    const DEMO_NOTIFICATIONS: Notification[] = [
        { id: 'n1', type: 'new_task', title: 'Nhiệm vụ mới', message: 'Bạn có nhiệm vụ mới: Làm bài tập Toán trang 45', taskId: 't1', taskTitle: 'Làm bài tập Toán trang 45', read: false, forRole: 'member', forUserId: 'm1', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'n2', type: 'new_task', title: 'Nhiệm vụ mới', message: 'Bạn có nhiệm vụ mới: Ôn từ vựng Tiếng Anh Unit 5', taskId: 't2', taskTitle: 'Ôn từ vựng Tiếng Anh Unit 5', read: true, forRole: 'member', forUserId: 'm2', createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];

    return {
        DEMO_PARENT,
        DEMO_MEMBERS,
        DEMO_TASKS,
        DEMO_NOTIFICATIONS
    };
}