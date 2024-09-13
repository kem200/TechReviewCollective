'use strict';

const { Category } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      { name: 'Smartphones' },
      { name: 'Laptops' },
      { name: 'Desktops' },
      { name: 'Monitors' },
      { name: 'Keyboards' },
      { name: 'Mice' },
      { name: 'Printers & Scanners' },
      { name: 'Computer Components' },
      { name: 'Storage Devices' },
      { name: 'Networking Equipment' },
      { name: 'Tablets' },
      { name: 'Smartwatches' },
      { name: 'Mobile Accessories' },
      { name: 'Wearable Tech' },
      { name: 'Headphones & Earbuds' },
      { name: 'Bluetooth & Smart Speakers' },
      { name: 'Soundbars' },
      { name: 'Home Theater Systems' },
      { name: 'Microphones' },
      { name: 'Gaming Consoles' },
      { name: 'Gaming PCs' },
      { name: 'VR Headsets' },
      { name: 'Gaming Accessories' },
      { name: 'Gaming Monitors' },
      { name: 'Smart Speakers' },
      { name: 'Smart Lighting' },
      { name: 'Smart Thermostats' },
      { name: 'Smart Plugs & Outlets' },
      { name: 'Smart Cameras & Doorbells' },
      { name: 'Home Automation Hubs' },
      { name: 'Smart Refrigerators' },
      { name: 'Smart Washers & Dryers' },
      { name: 'Smart Ovens & Microwaves' },
      { name: 'Robot Vacuums' },
      { name: 'Air Purifiers & Humidifiers' },
      { name: 'Digital Cameras' },
      { name: 'Camera Lenses & Accessories' },
      { name: 'Action Cameras' },
      { name: 'Drones' },
      { name: 'Camera Tripods & Mounts' },
      { name: 'Security Cameras' },
      { name: 'Projectors & Screens' },
      { name: 'Document Cameras' },
      { name: 'Fax Machines' },
      { name: 'Calculators' },
      { name: 'Label Printers' },
      { name: 'Fitness Trackers' },
      { name: 'Smart Glasses' },
      { name: 'Smart TVs' },
      { name: 'External Hard Drives' },
      { name: 'Solid-State Drives (SSD)' },
      { name: 'USB Flash Drives' },
      { name: 'Docking Stations & Hubs' },
      { name: 'Cooling Pads & Stands' },
      { name: 'Operating Systems' },
      { name: 'Office Software' },
      { name: 'Antivirus & Security' },
      { name: 'Productivity Software' },
      { name: 'Cloud Storage Services' },
      { name: 'GPS Devices' },
      { name: 'Dash Cameras' },
      { name: 'Car Audio & Video' },
      { name: 'Car Safety & Security' },
      { name: 'Car Smart Assistants' },
      { name: '3D Printers' },
      { name: '3D Scanners' },
      { name: 'Filament & Resins' },
      { name: 'Electric Shavers & Trimmers' },
      { name: 'Electric Toothbrushes' },
      { name: 'Hair Styling Tools' },
      { name: 'Massagers' },
      { name: 'Smart Health Devices' },
      { name: 'Health Tracking Devices' },
      { name: 'Sleep Monitors' },
      { name: 'E-Readers' },
      { name: 'Smart Pens' },
      { name: 'Digital Notebooks' },
      { name: 'Portable Projectors' },
      { name: 'Smart Wallets' }
    ];

    try {
      for (const category of categories) {
        console.log(`Attempting to create category: ${category.name}`);
        await Category.create(category, options);
        console.log(`Created category: ${category.name}`);
      }
    } catch (error) {
      console.error(`Failed to create category: ${error.message}`);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Categories";
    return queryInterface.bulkDelete('Categories', null, options);
  }
};
