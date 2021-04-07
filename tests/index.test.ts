import { mapperProperty, deepMapperProperty, deserialize, filterMapperProperty } from '../index';

class Lesson {
  @mapperProperty("ClassName")
  public name: string;
  @mapperProperty("Teacher")
  public teacher: string;
  @mapperProperty("DateTime", "datetime")
  public datetime: string;

  constructor() {
    this.name = "";
    this.teacher = "";
    this.datetime = "";
  }
}

class Address {
  @mapperProperty("province")
  public province: string;
  @mapperProperty("city")
  public city: string;
  @mapperProperty("full_address")
  public fullAddress: string;

  constructor() {
    this.province = "";
    this.city = "";
    this.fullAddress = "";
  }
}

const stateMap = { '1': '读书中', '2': '辍学', '3': '毕业' }

class Student {
  @mapperProperty("StudentID", "string")
  public id: string;
  @mapperProperty("StudentName", "string")
  public name: string;
  @mapperProperty("StudentAge", "int")
  public age: number;
  @mapperProperty("StudentSex", "int")
  public sex: number;
  @deepMapperProperty("Address", Address)
  public address?: Address;
  @deepMapperProperty("Lessons", Lesson)
  public lessons?: Lesson[];
  @filterMapperProperty("State", (val: number) => stateMap[`${val}`])
  public status: string;

  constructor() {
    this.id = "";
    this.name = "";
    this.age = 0;
    this.sex = 0;
    this.address = undefined;
    this.lessons = undefined;
    this.status = "";
  }
}

const json = {
  StudentID: "123456",
  StudentName: "李子明",
  StudentAge: "9",
  StudentSex: "1",
  Address: {
    province: "广东",
    city: "深圳",
    full_address: "xxx小学三年二班",
  },
  Lessons: [
    {
      ClassName: "中国上下五千年",
      Teacher: "建国老师",
      DateTime: 1609430399000,
    },
  ],
  State: 1,
};

const student = deserialize(Student, json);

test('name trans: StudentID 2 id', () => {
  expect(student.id).toBe('123456');
});
test('type trans: StudentAge 2 number age', () => {
  expect(student.age).toBe(9);
});
test('deep trans: Address 2 address', () => {
  const { address = { city: '' } } = student;
  expect(address.city).toBe('深圳');
});
test('inner filter: DateTime 2 datetime', () => {
  const [target] = student.lessons || [];
  expect(target.datetime).toBe('2020-12-31 23:59:59');
});
test('custom filter: State 2 status', () => {
  expect(student.status).toBe('辍学');
});
