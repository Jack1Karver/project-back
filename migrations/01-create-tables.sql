CREATE TABLE "author" (
	"id" serial NOT NULL,
	"lastName" varchar(20) NOT NULL,
	"firstName" varchar(20) NOT NULL,
	CONSTRAINT "author_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "bookResponse" (
	"id" serial NOT NULL,
	"idBookLiterary" int NOT NULL,
	"idUser" int NOT NULL,
	"createAt" DATE NOT NULL,
	"response" varchar(500) NOT NULL,
	"note" varchar(50) NOT NULL,
	CONSTRAINT "bookResponse_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "bookLiterary" (
	"id" serial NOT NULL,
	"idAuthor" int NOT NULL,
	"bookName" varchar(50) NOT NULL,
	"note" varchar(50) NOT NULL,
	CONSTRAINT "bookLiterary_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_table" (
	"id" serial NOT NULL,
	"firstName" varchar(25) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"secondName" varchar(25),
	"email" varchar(50) NOT NULL,
	"userName" varchar(20) NOT NULL,
	"password" varchar(500) NOT NULL,
	"rating" int NOT NULL,
	"createdAt" DATE NOT NULL,
	"enabled" bool NOT NULL,
	"avatar" TEXT,
	"isStaff" bool NOT NULL,
	"isSuperUser" bool NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userAddress" (
	"id" serial NOT NULL,
	"idUser" int NOT NULL,
	"addrIndex" varchar(6) NOT NULL,
	"addrCity" varchar(15) NOT NULL,
	"addrStreet" varchar(25) NOT NULL,
	"addrHouse" varchar(5) NOT NULL,
	"addrStructure" varchar(10) NOT NULL,
	"addrApart" varchar(3) NOT NULL,
	"isDefault" bool NOT NULL,
	CONSTRAINT "userAddress_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "status" (
	"id" serial NOT NULL,
	"name" varchar(10) NOT NULL,
	CONSTRAINT "status_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userMsg" (
	"id" serial NOT NULL,
	"idUser" int NOT NULL,
	"createAt" DATE NOT NULL,
	"text" varchar(250) NOT NULL,
	"notes" varchar(150) NOT NULL,
	"idStatus" int NOT NULL,
	"type" int NOT NULL,
	CONSTRAINT "userMsg_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "wishList" (
	"id" serial NOT NULL,
	"idUser" int NOT NULL,
	"createAt" DATE NOT NULL,
	"updateAt" DATE NOT NULL,
	"idStatus" int NOT NULL,
	"idUserAddress" int NOT NULL,
	CONSTRAINT "wishList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userList" (
	"id" serial NOT NULL,
	"typeList" int NOT NULL,
	"idList" int NOT NULL,
	CONSTRAINT "userList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "category" (
	"id" serial NOT NULL,
	"name" varchar(25) NOT NULL,
	"idParent" varchar(25) NOT NULL,
	"multiSelect" bool NOT NULL,
	CONSTRAINT "category_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userValueCategory" (
	"id" serial NOT NULL,
	"idUserList" int NOT NULL,
	"idCategory" int NOT NULL,
	CONSTRAINT "userValueCategory_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "offerList" (
	"id" serial NOT NULL,
	"idBookLiterary" int NOT NULL,
	"idUser" int NOT NULL,
	"IBSN" varchar(13) NOT NULL,
	"yearPublishing" DATE NOT NULL,
	"crateAt" DATE NOT NULL,
	"updateAt" DATE NOT NULL,
	"idStatus" int NOT NULL,
	CONSTRAINT "offerList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "exchangeList" (
	"id" serial NOT NULL,
	"idOfferList1" int NOT NULL,
	"idWishList1" int NOT NULL,
	"idOfferList2" int NOT NULL,
	"idWishList2" int NOT NULL,
	"createAt" DATE NOT NULL,
	"isBoth" bool NOT NULL,
	CONSTRAINT "exchangeList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "userExchangeList" (
	"id" serial NOT NULL,
	"idExchangeList" int NOT NULL,
	"idOfferList" int NOT NULL,
	"trackNumber" varchar(20) NOT NULL,
	"receiving" bool NOT NULL,
	CONSTRAINT "userExchangeList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "bookResponse" ADD CONSTRAINT "bookResponse_fk0" FOREIGN KEY ("idBookLiterary") REFERENCES "bookLiterary"("id");
ALTER TABLE "bookResponse" ADD CONSTRAINT "bookResponse_fk1" FOREIGN KEY ("idUser") REFERENCES "user_table"("id");

ALTER TABLE "bookLiterary" ADD CONSTRAINT "bookLiterary_fk0" FOREIGN KEY ("idAuthor") REFERENCES "author"("id");


ALTER TABLE "userAddress" ADD CONSTRAINT "userAddress_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id");


ALTER TABLE "userMsg" ADD CONSTRAINT "userMsg_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id");
ALTER TABLE "userMsg" ADD CONSTRAINT "userMsg_fk1" FOREIGN KEY ("idStatus") REFERENCES "status"("id");

ALTER TABLE "wishList" ADD CONSTRAINT "wishList_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id");
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_fk1" FOREIGN KEY ("idStatus") REFERENCES "status"("id");
ALTER TABLE "wishList" ADD CONSTRAINT "wishList_fk2" FOREIGN KEY ("idUserAddress") REFERENCES "userAddress"("id");

ALTER TABLE "userList" ADD CONSTRAINT "userList_fk0" FOREIGN KEY ("idList") REFERENCES "wishList"("id");

ALTER TABLE "userValueCategory" ADD CONSTRAINT "userValueCategory_fk0" FOREIGN KEY ("idUserList") REFERENCES "userList"("id");
ALTER TABLE "userValueCategory" ADD CONSTRAINT "userValueCategory_fk1" FOREIGN KEY ("idCategory") REFERENCES "category"("id");

ALTER TABLE "offerList" ADD CONSTRAINT "offerList_fk0" FOREIGN KEY ("idBookLiterary") REFERENCES "bookLiterary"("id");
ALTER TABLE "offerList" ADD CONSTRAINT "offerList_fk1" FOREIGN KEY ("idUser") REFERENCES "user_table"("id");
ALTER TABLE "offerList" ADD CONSTRAINT "offerList_fk2" FOREIGN KEY ("idStatus") REFERENCES "status"("id");

ALTER TABLE "exchangeList" ADD CONSTRAINT "exchangeList_fk0" FOREIGN KEY ("idOfferList1") REFERENCES "offerList"("id");
ALTER TABLE "exchangeList" ADD CONSTRAINT "exchangeList_fk1" FOREIGN KEY ("idWishList1") REFERENCES "wishList"("id");
ALTER TABLE "exchangeList" ADD CONSTRAINT "exchangeList_fk2" FOREIGN KEY ("idOfferList2") REFERENCES "offerList"("id");
ALTER TABLE "exchangeList" ADD CONSTRAINT "exchangeList_fk3" FOREIGN KEY ("idWishList2") REFERENCES "wishList"("id");

ALTER TABLE "userExchangeList" ADD CONSTRAINT "userExchangeList_fk0" FOREIGN KEY ("idExchangeList") REFERENCES "exchangeList"("id");
ALTER TABLE "userExchangeList" ADD CONSTRAINT "userExchangeList_fk1" FOREIGN KEY ("idOfferList") REFERENCES "offerList"("id");















