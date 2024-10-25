-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema 404travel
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema 404travel
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `404travel` DEFAULT CHARACTER SET utf8mb4 ;
USE `404travel` ;

-- -----------------------------------------------------
-- Table `404travel`.`accept_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`accept_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`account_status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`account_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`admin` (
  `id` INT NOT NULL,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  `email` VARCHAR(100) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `password` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `verificationCode` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `accountStatus` INT NOT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_admin_account_status1_idx` USING BTREE (`accountStatus`) VISIBLE,
  CONSTRAINT `fk_admin_account_status1`
    FOREIGN KEY (`accountStatus`)
    REFERENCES `404travel`.`account_status` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`availability`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`availability` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  `dialingCode` VARCHAR(10) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 196
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`currency`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`currency` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`destination`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`destination` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`custom_trip`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`custom_trip` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `durationFrom` DATE NULL DEFAULT NULL,
  `durationTo` DATE NULL DEFAULT NULL,
  `email` VARCHAR(100) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `phone` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `notes` TEXT CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `destination` INT NOT NULL,
  `country` INT NOT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_custom_trip_destination1_idx` USING BTREE (`destination`) VISIBLE,
  INDEX `fk_custom_trip_country1_idx` (`country` ASC) VISIBLE,
  CONSTRAINT `fk_custom_trip_destination1`
    FOREIGN KEY (`destination`)
    REFERENCES `404travel`.`destination` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_custom_trip_country1`
    FOREIGN KEY (`country`)
    REFERENCES `404travel`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`fuel_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`fuel_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`general_amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`general_amenities` (
  `id` INT NOT NULL,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`language`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`language` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  `nameShort` VARCHAR(10) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`other_amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`other_amenities` (
  `id` INT NOT NULL,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`owner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`owner` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(30) NOT NULL,
  `lastName` VARCHAR(45) NULL,
  `email` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `password` VARCHAR(15) NULL,
  `createTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `contact` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `language` INT NOT NULL,
  `verificationCode` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `accountStatus` INT NOT NULL,
  `country` INT NOT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_owner_account_status1_idx` USING BTREE (`accountStatus`) VISIBLE,
  INDEX `fk_owner_language1_idx` (`language` ASC) VISIBLE,
  INDEX `fk_owner_country1_idx` (`country` ASC) VISIBLE,
  CONSTRAINT `fk_owner_account_status1`
    FOREIGN KEY (`accountStatus`)
    REFERENCES `404travel`.`account_status` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_owner_language1`
    FOREIGN KEY (`language`)
    REFERENCES `404travel`.`language` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_owner_country1`
    FOREIGN KEY (`country`)
    REFERENCES `404travel`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_features`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_features` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_size_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_size_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_listing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_listing` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `placeName` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `propertyType` INT NOT NULL,
  `pickLocation` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `address` VARCHAR(225) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `size` INT NULL DEFAULT NULL,
  `propertySizeType` INT NOT NULL,
  `additionalRules` TEXT NULL DEFAULT NULL,
  `description` TEXT CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `coverImageRef` VARCHAR(150) NULL DEFAULT NULL,
  `availability` INT NOT NULL,
  `owner` INT NOT NULL,
  `nightMin` INT NULL DEFAULT NULL,
  `nightMax` INT NULL DEFAULT NULL,
  `availabilitySchedule` TEXT NULL DEFAULT NULL,
  `longTermDiscount` INT NULL DEFAULT NULL,
  `guests` INT NULL DEFAULT NULL,
  `bedrooms` INT NULL DEFAULT NULL,
  `beds` INT NULL DEFAULT NULL,
  `bathrooms` INT NULL DEFAULT NULL,
  `kitchen` INT NULL DEFAULT NULL,
  `insertedDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `location` VARCHAR(50) NULL,
  `review` JSON NULL,
  `country` INT NOT NULL,
  `property_description` TEXT NULL,
  `basePrice` INT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_accommodation_listing_property_type1_idx` USING BTREE (`propertyType`) VISIBLE,
  INDEX `fk_accommodation_listing_property_size_type1_idx` USING BTREE (`propertySizeType`) VISIBLE,
  INDEX `fk_property_listing_availability1_idx` USING BTREE (`availability`) VISIBLE,
  INDEX `fk_property_listing_ownwers1_idx` USING BTREE (`owner`) VISIBLE,
  INDEX `fk_property_listing_country1_idx` (`country` ASC) VISIBLE,
  CONSTRAINT `fk_accommodation_listing_property_size_type1`
    FOREIGN KEY (`propertySizeType`)
    REFERENCES `404travel`.`property_size_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_accommodation_listing_property_type1`
    FOREIGN KEY (`propertyType`)
    REFERENCES `404travel`.`property_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_listing_availability1`
    FOREIGN KEY (`availability`)
    REFERENCES `404travel`.`availability` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_listing_ownwers1`
    FOREIGN KEY (`owner`)
    REFERENCES `404travel`.`owner` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_listing_country1`
    FOREIGN KEY (`country`)
    REFERENCES `404travel`.`country` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ref` VARCHAR(255) CHARACTER SET 'utf8mb3' NOT NULL,
  `propertyListingId` INT NOT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_property_images_property_listing1_idx` USING BTREE (`propertyListingId`) VISIBLE,
  CONSTRAINT `fk_property_images_property_listing1`
    FOREIGN KEY (`propertyListingId`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_listing_has_general_amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_listing_has_general_amenities` (
  `propertyListing` INT NOT NULL,
  `generalAmenities` INT NOT NULL,
  `acceptType` INT NOT NULL,
  PRIMARY KEY USING BTREE (`propertyListing`, `generalAmenities`),
  INDEX `fk_accommodation_listing_has_general_amenities_general_amen_idx` USING BTREE (`generalAmenities`) VISIBLE,
  INDEX `fk_accommodation_listing_has_general_amenities_accommodatio_idx` USING BTREE (`propertyListing`) VISIBLE,
  INDEX `fk_property_listing_has_general_amenities_accept_type1_idx` USING BTREE (`acceptType`) VISIBLE,
  CONSTRAINT `fk_accommodation_listing_has_general_amenities_accommodation_1`
    FOREIGN KEY (`propertyListing`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_accommodation_listing_has_general_amenities_general_amenit1`
    FOREIGN KEY (`generalAmenities`)
    REFERENCES `404travel`.`general_amenities` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_listing_has_general_amenities_accept_type1`
    FOREIGN KEY (`acceptType`)
    REFERENCES `404travel`.`accept_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_listing_has_other_amenities`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_listing_has_other_amenities` (
  `propertyListing` INT NOT NULL,
  `otherAmenities` INT NOT NULL,
  PRIMARY KEY USING BTREE (`propertyListing`, `otherAmenities`),
  INDEX `fk_accommodation_listing_has_other_amenities_other_amenitie_idx` USING BTREE (`otherAmenities`) VISIBLE,
  INDEX `fk_accommodation_listing_has_other_amenities_accommodation__idx` USING BTREE (`propertyListing`) VISIBLE,
  CONSTRAINT `fk_accommodation_listing_has_other_amenities_accommodation_li1`
    FOREIGN KEY (`propertyListing`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_accommodation_listing_has_other_amenities_other_amenities1`
    FOREIGN KEY (`otherAmenities`)
    REFERENCES `404travel`.`other_amenities` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_listing_has_property_features`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_listing_has_property_features` (
  `propertyListingId` INT NOT NULL,
  `propertyFeaturesId` INT NOT NULL,
  PRIMARY KEY USING BTREE (`propertyListingId`, `propertyFeaturesId`),
  INDEX `fk_property_listing_has_property_features_property_features_idx` USING BTREE (`propertyFeaturesId`) VISIBLE,
  INDEX `fk_property_listing_has_property_features_property_listing1_idx` USING BTREE (`propertyListingId`) VISIBLE,
  CONSTRAINT `fk_property_listing_has_property_features_property_features1`
    FOREIGN KEY (`propertyFeaturesId`)
    REFERENCES `404travel`.`property_features` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_listing_has_property_features_property_listing1`
    FOREIGN KEY (`propertyListingId`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_rental_date_count`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_rental_date_count` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`property_rental_date_count_has_property_listing`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_rental_date_count_has_property_listing` (
  `propertyRentalDateCount` INT NOT NULL,
  `propertyListing` INT NOT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY USING BTREE (`propertyRentalDateCount`, `propertyListing`),
  INDEX `fk_property_rental_date_count_has_property_listing_property_idx` USING BTREE (`propertyListing`) VISIBLE,
  INDEX `fk_property_rental_date_count_has_property_listing_property_idx1` USING BTREE (`propertyRentalDateCount`) VISIBLE,
  CONSTRAINT `fk_property_rental_date_count_has_property_listing_property_l1`
    FOREIGN KEY (`propertyListing`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_property_rental_date_count_has_property_listing_property_r1`
    FOREIGN KEY (`propertyRentalDateCount`)
    REFERENCES `404travel`.`property_rental_date_count` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`gender`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`gender` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`user` (
  `firstName` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  `lastName` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `email` VARCHAR(100) CHARACTER SET 'utf8mb3' NOT NULL,
  `createTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `password` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `birthday` DATE NULL DEFAULT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  `country` INT NOT NULL,
  `verificationCode` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `accountStatus` INT NOT NULL,
  `language` INT NOT NULL,
  `gender` INT NOT NULL DEFAULT 1,
  `mobile` VARCHAR(25) NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_user_country1_idx` USING BTREE (`country`) VISIBLE,
  INDEX `fk_user_account_status1_idx` USING BTREE (`accountStatus`) VISIBLE,
  INDEX `fk_user_language1_idx` USING BTREE (`language`) VISIBLE,
  INDEX `fk_user_gender1_idx` (`gender` ASC) VISIBLE,
  CONSTRAINT `fk_user_account_status1`
    FOREIGN KEY (`accountStatus`)
    REFERENCES `404travel`.`account_status` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_country1`
    FOREIGN KEY (`country`)
    REFERENCES `404travel`.`country` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_language1`
    FOREIGN KEY (`language`)
    REFERENCES `404travel`.`language` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_user_gender1`
    FOREIGN KEY (`gender`)
    REFERENCES `404travel`.`gender` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`propertyorders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`propertyorders` (
  `id` INT NOT NULL,
  `user` INT NOT NULL,
  `propertyListing` INT NOT NULL,
  `durationFrom` DATE NOT NULL,
  `durationTo` DATE NOT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_orders_user1_idx` USING BTREE (`user`) VISIBLE,
  INDEX `fk_orders_property_listing1_idx` USING BTREE (`propertyListing`) VISIBLE,
  CONSTRAINT `fk_orders_property_listing1`
    FOREIGN KEY (`propertyListing`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_orders_user1`
    FOREIGN KEY (`user`)
    REFERENCES `404travel`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`tour_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`tour_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`tours`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`tours` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  `tourType` INT NOT NULL,
  `noOfNight` INT NULL DEFAULT NULL,
  `host` VARCHAR(45) CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `language` INT NOT NULL,
  `inclusions_exclusions` JSON NULL DEFAULT NULL,
  `description` JSON NULL DEFAULT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  `insertedDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `review` JSON NULL,
  `location` TEXT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_tours_tour_types1_idx` USING BTREE (`tourType`) VISIBLE,
  INDEX `fk_tours_language1_idx` USING BTREE (`language`) VISIBLE,
  CONSTRAINT `fk_tours_language1`
    FOREIGN KEY (`language`)
    REFERENCES `404travel`.`language` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_tours_tour_types1`
    FOREIGN KEY (`tourType`)
    REFERENCES `404travel`.`tour_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
AUTO_INCREMENT = 27
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`tour_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`tour_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `tours_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_tour_images_tours1_idx1` (`tours_id` ASC) VISIBLE,
  CONSTRAINT `fk_tour_images_tours1`
    FOREIGN KEY (`tours_id`)
    REFERENCES `404travel`.`tours` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`transmission_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`transmission_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`vehicle_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`vehicle_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  PRIMARY KEY USING BTREE (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`district`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`district` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`vehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`vehicle` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `vehicleNumber` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  `vehicleType` INT NOT NULL,
  `vehicleBrand` VARCHAR(45) NOT NULL,
  `model` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  `location` VARCHAR(45) CHARACTER SET 'utf8mb3' NOT NULL,
  `seatingCapacity` INT NOT NULL,
  `engineCapacity` INT NOT NULL,
  `transmissionType` INT NOT NULL,
  `fuel_type_id` INT NOT NULL,
  `luggageCapacity` INT NOT NULL,
  `vehicleDescription` TEXT CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `inclusions` TEXT NULL DEFAULT NULL,
  `availability_id` INT NOT NULL,
  `specialNote` TEXT CHARACTER SET 'utf8mb3' NULL DEFAULT NULL,
  `manufactureYear` INT NULL DEFAULT NULL,
  `owner` INT NOT NULL,
  `district_id` INT NOT NULL,
  `pricing` JSON NULL,
  `ownerName` VARCHAR(150) NULL,
  `insertedDate` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `review` JSON NULL,
  `basePrice` DOUBLE NULL,
  PRIMARY KEY USING BTREE (`id`, `vehicleNumber`),
  INDEX `fk_vehicle_vehicle_type_idx` USING BTREE (`vehicleType`) VISIBLE,
  INDEX `fk_vehicle_transmission_type1_idx` USING BTREE (`transmissionType`) VISIBLE,
  INDEX `fk_vehicle_fuel_type1_idx` USING BTREE (`fuel_type_id`) VISIBLE,
  INDEX `fk_vehicle_availability1_idx` USING BTREE (`availability_id`) VISIBLE,
  INDEX `fk_vehicle_owner1_idx` USING BTREE (`owner`) VISIBLE,
  INDEX `fk_vehicle_district1_idx` (`district_id` ASC) VISIBLE,
  CONSTRAINT `fk_vehicle_availability1`
    FOREIGN KEY (`availability_id`)
    REFERENCES `404travel`.`availability` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_vehicle_fuel_type1`
    FOREIGN KEY (`fuel_type_id`)
    REFERENCES `404travel`.`fuel_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_vehicle_owner1`
    FOREIGN KEY (`owner`)
    REFERENCES `404travel`.`owner` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_vehicle_transmission_type1`
    FOREIGN KEY (`transmissionType`)
    REFERENCES `404travel`.`transmission_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_vehicle_vehicle_type`
    FOREIGN KEY (`vehicleType`)
    REFERENCES `404travel`.`vehicle_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_vehicle_district1`
    FOREIGN KEY (`district_id`)
    REFERENCES `404travel`.`district` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`vehicle_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`vehicle_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ref` VARCHAR(255) CHARACTER SET 'utf8mb3' NOT NULL,
  `vehicleId` INT NOT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_category_vehicle1_idx` USING BTREE (`vehicleId`) VISIBLE,
  CONSTRAINT `fk_category_vehicle1`
    FOREIGN KEY (`vehicleId`)
    REFERENCES `404travel`.`vehicle` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`vehicleorders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`vehicleorders` (
  `id` INT NOT NULL,
  `user` INT NOT NULL,
  `vehicle` INT NOT NULL,
  `durationFrom` DATE NOT NULL,
  `durationTo` DATE NOT NULL,
  `price` DOUBLE NULL DEFAULT NULL,
  PRIMARY KEY USING BTREE (`id`),
  INDEX `fk_orders_user1_idx` USING BTREE (`user`) VISIBLE,
  INDEX `fk_orders_vehicle1_idx` USING BTREE (`vehicle`) VISIBLE,
  CONSTRAINT `fk_orders_user10`
    FOREIGN KEY (`user`)
    REFERENCES `404travel`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT,
  CONSTRAINT `fk_orders_vehicle10`
    FOREIGN KEY (`vehicle`)
    REFERENCES `404travel`.`vehicle` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3
ROW_FORMAT = DYNAMIC;


-- -----------------------------------------------------
-- Table `404travel`.`status`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` INT NOT NULL,
  `review` TEXT NOT NULL,
  `createdTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` INT NOT NULL,
  `point` DOUBLE NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_review_status1_idx` (`status_id` ASC) VISIBLE,
  INDEX `fk_review_user1_idx` (`user` ASC) VISIBLE,
  CONSTRAINT `fk_review_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `404travel`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_user1`
    FOREIGN KEY (`user`)
    REFERENCES `404travel`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`tours_has_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`tours_has_review` (
  `tours_id` INT NOT NULL,
  `review_id` INT NOT NULL,
  PRIMARY KEY (`tours_id`, `review_id`),
  INDEX `fk_tours_has_review_review1_idx` (`review_id` ASC) VISIBLE,
  INDEX `fk_tours_has_review_tours1_idx` (`tours_id` ASC) VISIBLE,
  CONSTRAINT `fk_tours_has_review_tours1`
    FOREIGN KEY (`tours_id`)
    REFERENCES `404travel`.`tours` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_tours_has_review_review1`
    FOREIGN KEY (`review_id`)
    REFERENCES `404travel`.`review` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`property_listing_has_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`property_listing_has_review` (
  `property_listing_id` INT NOT NULL,
  `review_id` INT NOT NULL,
  PRIMARY KEY (`property_listing_id`, `review_id`),
  INDEX `fk_property_listing_has_review_review1_idx` (`review_id` ASC) VISIBLE,
  INDEX `fk_property_listing_has_review_property_listing1_idx` (`property_listing_id` ASC) VISIBLE,
  CONSTRAINT `fk_property_listing_has_review_property_listing1`
    FOREIGN KEY (`property_listing_id`)
    REFERENCES `404travel`.`property_listing` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_property_listing_has_review_review1`
    FOREIGN KEY (`review_id`)
    REFERENCES `404travel`.`review` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`flight_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`flight_review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user` VARCHAR(45) NULL,
  `review` TEXT NULL,
  `createdTime` TIMESTAMP NULL,
  `status_id` INT NOT NULL,
  `point` DOUBLE NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_flight_review_status1_idx` (`status_id` ASC) VISIBLE,
  CONSTRAINT `fk_flight_review_status1`
    FOREIGN KEY (`status_id`)
    REFERENCES `404travel`.`status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`vehicle_has_review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`vehicle_has_review` (
  `vehicle_id` INT NOT NULL,
  `review_id` INT NOT NULL,
  PRIMARY KEY (`vehicle_id`, `review_id`),
  INDEX `fk_vehicle_has_review_review1_idx` (`review_id` ASC) VISIBLE,
  INDEX `fk_vehicle_has_review_vehicle1_idx` (`vehicle_id` ASC) VISIBLE,
  CONSTRAINT `fk_vehicle_has_review_vehicle1`
    FOREIGN KEY (`vehicle_id`)
    REFERENCES `404travel`.`vehicle` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vehicle_has_review_review1`
    FOREIGN KEY (`review_id`)
    REFERENCES `404travel`.`review` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `404travel`.`newsletter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`newsletter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(85) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `404travel`.`flight_class_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `404travel`.`flight_class_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
