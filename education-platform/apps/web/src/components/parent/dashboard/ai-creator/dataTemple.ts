import { Question } from '@/types/types';


export const AI_TEMPLATES: Record<string, Question[]> = {
    math: [
        { id: 'q1', text: '3/4 + 1/2 = ?', type: 'multiple_choice', options: ['5/4', '4/6', '7/4', '1/4'], correctAnswer: '5/4' },
        { id: 'q2', text: 'Hình chữ nhật dài 12cm, rộng 7cm. Tính chu vi?', type: 'short_answer', correctAnswer: '38 cm' },
        { id: 'q3', text: 'Số nào là bội của 6?', type: 'multiple_choice', options: ['14', '18', '20', '22'], correctAnswer: '18' },
        { id: 'q4', text: '125 ÷ 5 = ?', type: 'multiple_choice', options: ['23', '24', '25', '26'], correctAnswer: '25' },
    ],
    english: [
        { id: 'q1', text: 'What is the past tense of "go"?', type: 'multiple_choice', options: ['goed', 'went', 'gone', 'going'], correctAnswer: 'went' },
        { id: 'q2', text: 'Fill in the blank: She ___ to school every day.', type: 'multiple_choice', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 'goes' },
        { id: 'q3', text: 'Dịch: "Tôi thích đọc sách"', type: 'short_answer', correctAnswer: 'I like reading books.' },
        { id: 'q4', text: 'Which word is a noun?', type: 'multiple_choice', options: ['quickly', 'beautiful', 'happiness', 'run'], correctAnswer: 'happiness' },
    ],
    science: [
        { id: 'q1', text: 'Hành tinh nào lớn nhất trong hệ mặt trời?', type: 'multiple_choice', options: ['Trái Đất', 'Sao Hỏa', 'Sao Mộc', 'Sao Thổ'], correctAnswer: 'Sao Mộc' },
        { id: 'q2', text: 'Nước đóng băng ở mấy độ C?', type: 'multiple_choice', options: ['-10°C', '0°C', '4°C', '10°C'], correctAnswer: '0°C' },
        { id: 'q3', text: 'Quá trình cây xanh tạo chất dinh dưỡng từ ánh sáng gọi là gì?', type: 'short_answer', correctAnswer: 'Quang hợp' },
        { id: 'q4', text: 'Động vật nào là động vật có vú?', type: 'multiple_choice', options: ['Cá voi', 'Cá mập', 'Cá chép', 'Ếch'], correctAnswer: 'Cá voi' },
    ],
}


export const SUGGESTIONS = [
    '🔢 4 câu trắc nghiệm Toán lớp 5 về phân số',
    '🇬🇧 Bài tập Tiếng Anh về thì hiện tại đơn',
    '🔬 Câu hỏi Khoa học về hệ mặt trời',
    '➗ Bài tập Toán nhân chia số thập phân',
];
