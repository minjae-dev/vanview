export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
export interface Businesses {
  atus: string;
  issueddate: string;
  expireddate: string;
  businesstype: string;
  businesssubtype: string | null;
  businesstradename: string | null;
  businessname: string;
  unit: string | null;
  unittype: string | null;
  house: string | null;
  street: string | null;
  city: string;
  province: string;
  country: string;
  postalcode: string | null;
  localarea: string;
  numberofemployees: number;
  status: string;
  extractdate: string;
  feepaid: string | null;
  folderyear: string;
  geo_point_2d: {
    lat: number;
    lon: number;
  } | null;
  geom: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: object;
  };
  licencenumber: string;
  licencerevisionnumber: string;
  licencersn: string;
}
