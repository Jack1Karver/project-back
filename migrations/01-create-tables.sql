CREATE TABLE "author" (
	"id" serial NOT NULL,
	"lastName" varchar(20) NOT NULL,
	"firstName" varchar(20),
	CONSTRAINT "author_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "book_response" (
	"id" serial NOT NULL,
	"idBookLiterary" int NOT NULL,
	"idUser" int NOT NULL,
	"createAt" DATE NOT NULL,
	"response" varchar(500) NOT NULL,
	"note" varchar(50),
	CONSTRAINT "bookResponse_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "book_literary" (
	"id" serial NOT NULL,
	"idAuthor" int NOT NULL,
	"bookName" varchar(50) NOT NULL,
	"note" varchar(50),
	CONSTRAINT "bookLiterary_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_table" (
	"id" serial NOT NULL,
	"name" varchar(25) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"secondName" varchar(25) NOT NULL,
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



CREATE TABLE "user_address" (
	"id" serial NOT NULL,
	"idUser" int NOT NULL,
	"addrIndex" varchar(6) NOT NULL,
	"addrCity" varchar(15) NOT NULL,
	"addrStreet" varchar(25) NOT NULL,
	"addrHouse" varchar(5) NOT NULL,
	"addrStructure" varchar(10),
	"addrApart" varchar(3),
	"isDefault" bool NOT NULL,
	CONSTRAINT "userAddress_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "status" (
	"id" serial NOT NULL,
	"name" varchar(10),
	CONSTRAINT "status_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_msg" (
	"id" serial NOT NULL,
	"idUser" int NOT NULL,
	"createAt" DATE NOT NULL,
	"text" varchar(250) NOT NULL,
	"notes" varchar(150),
	"idStatus" int NOT NULL,
	"type" int NOT NULL,
	CONSTRAINT "userMsg_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "wish_list" (
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



CREATE TABLE "user_list" (
	"id" serial NOT NULL,
	"idOfferList" int,
	"idWishList" int,
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



CREATE TABLE "user_value_category" (
	"id" serial NOT NULL,
	"idUserList" int NOT NULL,
	"idCategory" int NOT NULL,
	CONSTRAINT "userValueCategory_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "offer_list" (
	"id" serial NOT NULL,
	"idBookLiterary" int NOT NULL,
	"idUser" int NOT NULL,
	"ISBN" varchar(13),
	"yearPublishing" DATE NOT NULL,
	"createAt" DATE NOT NULL,
	"updateAt" DATE NOT NULL,
	"idStatus" int NOT NULL,
	CONSTRAINT "offerList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "exchange_list" (
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



CREATE TABLE "user_exchange_list" (
	"id" serial NOT NULL,
	"idExchangeList" int NOT NULL,
	"idOfferList" int NOT NULL,
	"trackNumber" varchar(20) NOT NULL,
	"receiving" bool NOT NULL,
	CONSTRAINT "userExchangeList_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "book_response" ADD CONSTRAINT "book_response_fk0" FOREIGN KEY ("idBookLiterary") REFERENCES "book_literary"("id") ON DELETE CASCADE;
ALTER TABLE "book_response" ADD CONSTRAINT "book_response_fk1" FOREIGN KEY ("idUser") REFERENCES "user_table"("id") ON DELETE CASCADE;

ALTER TABLE "book_literary" ADD CONSTRAINT "book_literary_fk0" FOREIGN KEY ("idAuthor") REFERENCES "author"("id") ON DELETE CASCADE;


ALTER TABLE "user_address" ADD CONSTRAINT "user_address_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id") ON DELETE CASCADE;


ALTER TABLE "user_msg" ADD CONSTRAINT "user_msg_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id") ON DELETE CASCADE;
ALTER TABLE "user_msg" ADD CONSTRAINT "user_msg_fk1" FOREIGN KEY ("idStatus") REFERENCES "status"("id") ON DELETE CASCADE;

ALTER TABLE "wish_list" ADD CONSTRAINT "wish_list_fk0" FOREIGN KEY ("idUser") REFERENCES "user_table"("id") ON DELETE CASCADE;
ALTER TABLE "wish_list" ADD CONSTRAINT "wish_list_fk1" FOREIGN KEY ("idStatus") REFERENCES "status"("id") ON DELETE CASCADE;
ALTER TABLE "wish_list" ADD CONSTRAINT "wish_list_fk2" FOREIGN KEY ("idUserAddress") REFERENCES "user_address"("id") ON DELETE CASCADE;

ALTER TABLE "user_list" ADD CONSTRAINT "user_list_fk0" FOREIGN KEY ("idWishList") REFERENCES "wish_list"("id") ON DELETE CASCADE;
ALTER TABLE "user_list" ADD CONSTRAINT "user_list_fk1" FOREIGN KEY ("idOfferList") REFERENCES "offer_list"("id") ON DELETE CASCADE;

ALTER TABLE "user_value_category" ADD CONSTRAINT "user_value_category_fk0" FOREIGN KEY ("idUserList") REFERENCES "user_list"("id") ON DELETE CASCADE;
ALTER TABLE "user_value_category" ADD CONSTRAINT "user_value_category_fk1" FOREIGN KEY ("idCategory") REFERENCES "category"("id") ON DELETE CASCADE;
 
ALTER TABLE "offer_list" ADD CONSTRAINT "offer_list_fk0" FOREIGN KEY ("idBookLiterary") REFERENCES "book_literary"("id") ON DELETE CASCADE;
ALTER TABLE "offer_list" ADD CONSTRAINT "offer_list_fk1" FOREIGN KEY ("idUser") REFERENCES "user_table"("id") ON DELETE CASCADE;
ALTER TABLE "offer_list" ADD CONSTRAINT "offer_list_fk2" FOREIGN KEY ("idStatus") REFERENCES "status"("id") ON DELETE CASCADE;

ALTER TABLE "exchange_list" ADD CONSTRAINT "exchange_list_fk0" FOREIGN KEY ("idOfferList1") REFERENCES "offer_list"("id") ON DELETE CASCADE;
ALTER TABLE "exchange_list" ADD CONSTRAINT "exchange_list_fk1" FOREIGN KEY ("idWishList1") REFERENCES "wish_list"("id") ON DELETE CASCADE;
ALTER TABLE "exchange_list" ADD CONSTRAINT "exchange_list_fk2" FOREIGN KEY ("idOfferList2") REFERENCES "offer_list"("id") ON DELETE CASCADE;
ALTER TABLE "exchange_list" ADD CONSTRAINT "exchange_list_fk3" FOREIGN KEY ("idWishList2") REFERENCES "wish_list"("id") ON DELETE CASCADE;

ALTER TABLE "user_exchange_list" ADD CONSTRAINT "user_exchange_list_fk0" FOREIGN KEY ("idExchangeList") REFERENCES "exchange_list"("id") ON DELETE CASCADE;
ALTER TABLE "user_exchange_list" ADD CONSTRAINT "user_exchange_list_fk1" FOREIGN KEY ("idOfferList") REFERENCES "offer_list"("id") ON DELETE CASCADE;















