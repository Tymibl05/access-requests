import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

export const data = {
  users: [
    {
      _id: '0000000000000000000dcops',
      name: 'DC Operator',
      email: 'dcops@test.com',
      password_hash: bcrypt.hashSync('dcops'),
      company_id: '111111111111111111client',
      is_active: true,
    },
    {
      _id: '00000000000000000dmiller',
      name: 'David Miller',
      email: 'dmiller@test.com',
      password_hash: bcrypt.hashSync('dmiller'),
      company_id: '111111111111111111client',
      is_active: true,
    },
    {
      _id: '00000000000000000mbarnes',
      name: 'Matt Barnes',
      email: 'mbarnes@test.com',
      password_hash: bcrypt.hashSync('mbarnes'),
      company_id: '111111111111111111costco',
      is_active: true,
    },
    {
      _id: '000000000000000000sleach',
      name: 'Steve Leach',
      email: 'sleach@test.com',
      password_hash: bcrypt.hashSync('sleach'),
      company_id: '111111111111111111costco',
      is_active: true,
    },
    {
      _id: '000000000000000000ctaber',
      name: 'Cathy Taber',
      email: 'ctaber@test.com',
      password_hash: bcrypt.hashSync('ctaber'),
      company_id: '111111111111111111costco',
      is_active: true,
    },
    {
      _id: '000000000000000delladmin',
      name: 'Dell Admin',
      email: 'delladmin@test.com',
      password_hash: bcrypt.hashSync('delladmin'),
      company_id: '11111111111111111111dell',
      is_active: true,
    },
    {
      _id: '000000000000000delltech1',
      name: 'Dell Tech 1',
      email: 'delltech1@test.com',
      password_hash: bcrypt.hashSync('delltech1'),
      company_id: '11111111111111111111dell',
      is_active: true,
    },
    {
      _id: '000000000000000delltech2',
      name: 'Dell Tech 2',
      email: 'delltech2@test.com',
      password_hash: bcrypt.hashSync('delltech2'),
      company_id: '11111111111111111111dell',
      is_active: true,
    },
    {
      _id: '000000000000000delltech3',
      name: 'Dell Tech 3',
      email: 'delltech3@test.com',
      password_hash: bcrypt.hashSync('delltech3'),
      company_id: '11111111111111111111dell',
      is_active: true,
    },
    {
      _id: '0000000000000000ibmadmin',
      name: 'IBM Admin',
      email: 'ibmadmin@test.com',
      password_hash: bcrypt.hashSync('ibmadmin'),
      company_id: '111111111111111111111ibm',
      is_active: true,
    },
    {
      _id: '0000000000000000ibmtech1',
      name: 'IBM Tech 1',
      email: 'ibmtech1@test.com',
      password_hash: bcrypt.hashSync('ibmtech1'),
      company_id: '111111111111111111111ibm',
      is_active: true,
    },
    {
      _id: '0000000000000000ibmtech2',
      name: 'IBM Tech 2',
      email: 'ibmtech2@test.com',
      password_hash: bcrypt.hashSync('ibmtech2'),
      company_id: '111111111111111111111ibm',
      is_active: true,
    },
    {
      _id: '0000000000000000ibmtech3',
      name: 'IBM Tech 3',
      email: 'ibmtech3@test.com',
      password_hash: bcrypt.hashSync('ibmtech3'),
      company_id: '111111111111111111111ibm',
      is_active: false,
    },
    {
      _id: '0000000000000000000guest',
      name: 'Guest Visitor',
      company_id: '1111111111111111111guest',
      is_active: true,
    },
  ],
  companies: [
    {
      _id: '111111111111111111client',
      name: 'WDC Operations',
      is_client: true,
      is_trusted: true,
      admins: ['0000000000000000000dcops', '00000000000000000dmiller'],
      req_counter: 11,
    },
    {
      _id: '111111111111111111costco',
      name: 'Costco Wholesale',
      is_client: false,
      is_trusted: true,
      admins: [
        '00000000000000000mbarnes',
        '000000000000000000ctaber',
        '000000000000000000sleach',
      ],
    },
    {
      _id: '11111111111111111111dell',
      name: 'Dell Corporation',
      is_client: false,
      is_trusted: true,
      admins: ['000000000000000delladmin'],
    },
    {
      _id: '111111111111111111111ibm',
      name: 'IBM',
      is_client: false,
      is_trusted: true,
      admins: ['0000000000000000ibmadmin'],
    },
    {
      _id: '1111111111111111111guest',
      name: 'Guest',
      is_client: false,
      is_trusted: false,
    },
  ],
  requests: [
    {
      name: 'REQ0000001', // REQ00000000
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'active', // active, pending, completed, cancelled
      window: {
        start: new Date(2023, 2, 11, 8, 0),
        end: new Date(2023, 3, 11, 18, 0),
      }, // new Date(year, month , day , hours , minutes , seconds, milliseconds);
      visitors: [
        {
          user_id: '00000000000000000mbarnes',
          user_name: 'Matt Barnes',
          is_onsite: true,
        },
        {
          user_id: '000000000000000000ctaber',
          user_name: 'Cathy Taber',
          is_onsite: true,
        },
        {
          user_id: '000000000000000000sleach',
          user_name: 'Steve Leach',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000002',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'active',
      window: {
        start: new Date(2023, 8, 15, 8, 0),
        end: new Date(2023, 8, 17, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000ibmtech3',
          user_name: 'IBM Tech 3',
          is_onsite: true,
        },
        {
          user_id: '0000000000000000ibmtech1',
          user_name: 'IBM Tech 1',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000003',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'active',
      window: {
        start: new Date(2023, 2, 11, 10, 0),
        end: new Date(2023, 2, 11, 16, 0),
      },
      visitors: [
        {
          user_id: '000000000000000delltech1',
          user_name: 'Dell Tech 1',
          is_onsite: true,
        },
        {
          user_id: '000000000000000delltech2',
          user_name: 'Dell Tech 2',
          is_onsite: true,
        },
        {
          user_id: '000000000000000delltech3',
          user_name: 'Dell Tech 3',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000004',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'active',
      window: {
        start: new Date(2023, 5, 11, 8, 0),
        end: new Date(2023, 5, 11, 14, 0),
      },
      visitors: [
        {
          user_id: '000000000000000delltech1',
          user_name: 'Dell Tech 1',
          is_onsite: false,
        },
        {
          user_id: '000000000000000delltech2',
          user_name: 'Dell Tech 2',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000005',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'pending',
      window: {
        start: new Date(2023, 3, 15, 10, 0),
        end: new Date(2023, 3, 16, 16, 0),
      },
      visitors: [
        {
          user_id: '000000000000000delltech3',
          user_name: 'Dell Tech 3',
          is_onsite: false,
        },
        {
          user_id: '000000000000000delltech2',
          user_name: 'Dell Tech 2',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000006',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'active',
      window: {
        start: new Date(2023, 3, 14, 8, 0),
        end: new Date(2023, 3, 14, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000ibmtech2',
          user_name: 'IBM Tech 2',
          is_onsite: false,
        },
        {
          user_id: '0000000000000000ibmtech3',
          user_name: 'IBM Tech 3',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000007',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'pending',
      window: {
        start: new Date(2023, 5, 11, 8, 0),
        end: new Date(2023, 5, 11, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000ibmtech3',
          user_name: 'IBM Tech 3',
          is_onsite: false,
        },
        {
          user_id: '0000000000000000ibmtech1',
          user_name: 'IBM Tech 1',
          is_onsite: false,
        },
        {
          user_id: '0000000000000000ibmtech2',
          user_name: 'IBM Tech 2',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000008',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'pending',
      window: {
        start: new Date(2023, 5, 11, 8, 0),
        end: new Date(2023, 5, 11, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000ibmtech1',
          user_name: 'IBM Tech 1',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000009',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'pending',
      window: {
        start: new Date(2023, 5, 11, 8, 0),
        end: new Date(2023, 5, 11, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000000guest',
          user_name: 'Guest Visitor',
          is_onsite: false,
        },
      ],
    },
    {
      name: 'REQ00000010',
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Soluta earum a exercitationem, eligendi voluptate voluptatum sint suscipit sequi, mollitia similique odio iure enim, quo repellendus.',
      status: 'cancelled',
      window: {
        start: new Date(2023, 5, 11, 8, 0),
        end: new Date(2023, 5, 11, 14, 0),
      },
      visitors: [
        {
          user_id: '0000000000000000000guest',
          user_name: 'Guest Visitor',
          is_onsite: false,
        },
      ],
    },
  ],
  badges: [
    {
      number: 1,
      access_level: 'data',
      is_available: false,
      assigned_to: '0000000000000000ibmtech3',
    },
    {
      number: 2,
      access_level: 'data',
      is_available: false,
      assigned_to: '000000000000000delltech1',
    },
    {
      number: 3,
      access_level: 'data',
      is_available: false,
      assigned_to: '000000000000000delltech2',
    },
    {
      number: 4,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 5,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 6,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 7,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 8,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 9,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
    {
      number: 10,
      access_level: 'data',
      is_available: true,
      assigned_to: false,
    },
  ],
  logs: [
    {
      type: '', // user, company, request, badge
      action: '', // crud
      message: '',
    }, // addLog(type, action, message)
  ],
};
