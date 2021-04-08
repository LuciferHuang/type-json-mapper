# type-json-mapper

## Introduction

Instead of directly using api data, we definitely require an adapter layer to transform data as needed. Furthermore, the adapter inverse the the data dependency from API server(API Server is considered uncontrollable and highly unreliable as data structure may be edit by backend coder for some specific purposes)to our adapter which becomes reliable. Thus, this library is created as the adapter.

### Doc
[中文文档](https://melonfield.club/column/detail/cvfCiXD8OBn)

### Get Started

```bash
npm install type-json-mapper --save
```

## Language

- Typescript

## Example

Here is a complex example, hopefully could give you an idea of how to use it:

```typescript
import { mapperProperty, deepMapperProperty, filterMapperProperty } from "type-json-mapper";

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
  public province: string;
  public city: string;
  @mapperProperty("full_address")
  public fullAddress: string;

  constructor() {
    this.province = "";
    this.city = "";
    this.fullAddress = "";
  }
}

class Student {
  @mapperProperty("StudentID", "string")
  public id: string;
  @mapperProperty("StudentName", "string")
  public name: string;
  @mapperProperty("StudentAge", "int")
  public age: number;
  @filterMapperProperty("StudentSex", (val) => {
    const map = { 1: '男生', 2: '女生'};
    return map[val];
  })
  public sex: string;
  @deepMapperProperty("Address", Address)
  public address?: Address;
  @deepMapperProperty("Lessons", Lesson)
  public lessons?: Lesson[];

  constructor() {
    this.id = "";
    this.name = "";
    this.age = 0;
    this.sex = 0;
    this.address = undefined;
    this.lessons = undefined;
  }
}
```

Now here is what API server return, assume it is already parsed to JSON object.

```typescript
let json = {
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
};
```

Simply, just map it use following code. 

```typescript
import { deserialize } from 'type-json-mapper';
try {
  const student = deserialize(Student, json);
  console.dir(student);
} catch(err) {
  console.error(err);
}

```
![result.png](https://i.loli.net/2021/04/09/kPJW6Nn5gduBZXq.png)

## License
[MIT](./LICENSE)
## ChangeLog
1. add serialize --2021/01/03 [HLianfa](https://github.com/Hlianfa)
2. add doc --2021/01/04 [HLianfa](https://github.com/Hlianfa)
3. fix deep serialize & deep deserialize --2021/01/05 [HLianfa](https://github.com/Hlianfa)
4. eliminate redundancy --2021/01/10 [HLianfa](https://github.com/Hlianfa)
5. change entry file --2021/01/10 [HLianfa](https://github.com/Hlianfa)
6. add custom filter --2021/04/09 [HLianfa](https://github.com/Hlianfa)
