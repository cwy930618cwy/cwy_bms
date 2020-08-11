import request from '@/utils/request'

export function departmentList(query: any) {
  return request({
    url: '/uc/ucDept/tree',
    method: 'get',
    params: query
  })
}

export function departmentListPage(data: any) {
  return data1
  // return request({
  //   url: '/uc/ucDept/listPage',
  //   method: 'post',
  //   data
  // })
}

export function departmentDetail(query: any) {
  return request({
    url: '/uc/ucDept/detailDept/' + query,
    method: 'get'
  })
}

export function departmentUpdate(data: any) {
  return request({
    url: '/uc/ucDept/detailDept',
    method: 'post',
    data
  })
}

export function departmentDelete(query: any) {
  return request({
    url: '/uc/ucDept/delete/' + query,
    method: 'delete'
  })
}

export function getUserList(data: any) {
  return data2
  // return request({
  //   url: '/uc/v1/user/list',
  //   method: 'post',
  //   data
  // })
}

export function getSelectSysAdminListByCurrentUser() {
  return request({
    url: '/uc/ucSubSystem/selectSysAdminListByCurrentUser',
    method: 'get'
  })
}

export function getAllocationDeptSysAdmin(data: any) {
  return request({
    url: '/uc/ucUserSystemRelation/allocationDeptSysAdmin',
    method: 'post',
    data
  })
}





const data1 = {
  "number": 1,
  "totalPages": 40,
  "totalElements": 1,
  "elementsNo": 0,
  "limit": 500,
  "content": [
      {
          "id": 1,
          "parentId": 0,
          "deptName": "马士兵教育科技有限公司",
          "deptType": 1,
          "tag": "这是马士兵教育科技有限公司",
          "sort": 1,
          "gmtCreate": 1596423658229,
          "gmtModified": 1596423722093,
          "createUid": "0",
          "createUname": "0",
          "modifiedUid": "0",
          "modifiedUname": "0",
          "enabled": 1,
          "deptVOS": [
              {
                  "id": 2,
                  "parentId": 1,
                  "deptName": "人事部子部1",
                  "deptType": 1,
                  "tag": "这是人事部子部1",
                  "sort": 2,
                  "gmtCreate": 1596423840441,
                  "gmtModified": 0,
                  "createUid": "0",
                  "createUname": "0",
                  "modifiedUid": "0",
                  "modifiedUname": "0",
                  "enabled": 1,
                  "deptVOS": []
              },
              {
                  "id": 3,
                  "parentId": 1,
                  "deptName": "人事部子部2",
                  "deptType": 1,
                  "tag": "这是人事部子部2",
                  "sort": 2,
                  "gmtCreate": 1596423847573,
                  "gmtModified": 0,
                  "createUid": "0",
                  "createUname": "0",
                  "modifiedUid": "0",
                  "modifiedUname": "0",
                  "enabled": 1,
                  "deptVOS": []
              }
          ]
      }
  ]
}


const data2 = {
  "content": [
    {
      "avatar": "",
      "birthday": "",
      "city": "",
      "createUid": "",
      "createUname": "",
      "deptId": 0,
      "email": "",
      "enabled": 0,
      "gender": 0,
      "gmtCreate": 0,
      "gmtModified": 0,
      "id": 0,
      "job": "",
      "managerFlag": 0,
      "memberLevelId": 0,
      "modifiedUid": "",
      "modifiedUname": "",
      "nickname": "",
      "password": "",
      "personalizedSignature": "",
      "phone": "",
      "pwdResetTime": 0,
      "roleList": [
        {
          "roleName": "",
          "roleValue": [
            {
              "canonicalKeyPropertyListString": "",
              "canonicalName": "",
              "domain": "",
              "domainPattern": true,
              "keyPropertyList": {},
              "keyPropertyListString": "",
              "pattern": true,
              "propertyListPattern": true,
              "propertyPattern": true,
              "propertyValuePattern": true
            }
          ]
        }
      ],
      "sourceType": 0,
      "userType": 0,
      "username": ""
    }
  ],
  "elementsNo": 0,
  "limit": 0,
  "number": 0,
  "totalElements": 0,
  "totalPages": 0
}