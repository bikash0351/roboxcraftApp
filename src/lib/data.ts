
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageIds: string[];
  category: 'Kits' | 'Components' | 'Recommendation';
}

export interface ProductRecommendation {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  originalPrice?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageId: string;
}

export interface User {
  id: string;
  name: string;
  imageId: string;
}

export interface Reel {
  id: string;
  user: User;
  description: string;
  likes: number;
  comments: number;
}

export const products: Product[] = [
  { id: 'kit001', name: 'Arduino Uno Starter Kit', price: 39.99, originalPrice: 59.99, imageIds: ['kit-arduino', 'kit-arduino-2', 'kit-arduino-3'], category: 'Kits' },
  { id: 'kit002', name: 'Raspberry Pi 4 Robotics Kit', price: 109.99, originalPrice: 129.99, imageIds: ['kit-raspberry-pi', 'kit-raspberry-pi-2'], category: 'Kits' },
  { id: 'kit003', name: 'Self-Balancing Robot Kit', price: 79.99, originalPrice: 99.99, imageIds: ['kit-self-balancing', 'kit-self-balancing-2'], category: 'Kits' },
  { id: 'kit004', name: '4-DOF Robotic Arm Kit', price: 65.50, originalPrice: 85.50, imageIds: ['kit-robotic-arm', 'kit-robotic-arm-2'], category: 'Kits' },
  { id: 'comp001', name: 'SG90 Micro Servo Motor', price: 2.99, originalPrice: 4.99, imageIds: ['component-servo', 'component-servo-2'], category: 'Components' },
  { id: 'comp002', name: 'HC-SR04 Ultrasonic Sensor', price: 1.99, originalPrice: 3.50, imageIds: ['component-ultrasonic', 'component-ultrasonic-2'], category: 'Components' },
  { id: 'comp003', name: 'L298N Motor Driver Module', price: 5.99, originalPrice: 7.99, imageIds: ['component-motor-driver', 'component-motor-driver-2'], category: 'Components' },
  { id: 'comp004', name: 'ESP32-CAM WiFi + Bluetooth', price: 9.99, originalPrice: 12.99, imageIds: ['component-esp32', 'component-esp32-2'], category: 'Components' },
  { id: 'kit005', name: 'Obstacle Avoiding Car Kit', price: 55.00, originalPrice: 75.00, imageIds: ['kit-obstacle-car', 'kit-obstacle-car-2'], category: 'Kits' },
  { id: 'kit006', name: 'Spider Robot Kit', price: 99.00, originalPrice: 120.00, imageIds: ['kit-spider-robot', 'kit-spider-robot-2'], category: 'Kits' },
  { id: 'comp005', name: 'MPU-6050 6-Axis Gyro/Accelerometer', price: 4.50, originalPrice: 6.50, imageIds: ['component-gyro', 'component-gyro-2'], category: 'Components' },
  { id: 'comp006', name: 'DC 6V Geared Motor', price: 3.00, originalPrice: 5.00, imageIds: ['component-geared-motor', 'component-geared-motor-2'], category: 'Components' },
];

export const courses: Course[] = [
    { id: 'course001', title: 'Introduction to Robotics with Arduino', description: 'A beginner-friendly course to get started with electronics and programming.', imageId: 'course-arduino' },
    { id: 'course002', title: 'Advanced Robotics with Raspberry Pi', description: 'Learn to build complex robots with computer vision and AI.', imageId: 'course-raspberry-pi' },
    { id: 'course003', title: '3D Printing for Robotics', description: 'Design and print custom parts for your robotic projects.', imageId: 'course-3d-printing' },
];

export const users: User[] = [
    { id: 'user001', name: 'TechieTom', imageId: 'user-avatar-1' },
    { id: 'user002', name: 'CircuitChloe', imageId: 'user-avatar-2' },
    { id: 'user003', name: 'RoboRachel', imageId: 'user-avatar-3' },
];

export const reels: Reel[] = [
    { id: 'reel001', user: users[0], description: 'My new robotic arm build in action! #robotics #diy', likes: 1256, comments: 42 },
    { id: 'reel002', user: users[1], description: 'Line follower robot racing! So much fun.', likes: 879, comments: 23 },
    { id: 'reel003', user: users[2], description: 'Unboxing the latest kit from RoboMart!', likes: 2401, comments: 112 },
];
