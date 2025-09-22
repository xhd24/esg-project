-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        12.0.2-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- esg_app 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `esg_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `esg_app`;

-- 테이블 esg_app.categories 구조 내보내기
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ko` varchar(30) NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name_ko` (`name_ko`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 esg_app.categories:~2 rows (대략적) 내보내기
INSERT INTO `categories` (`category_id`, `name_ko`) VALUES
	(1, '조선'),
	(2, '자동차');

-- 테이블 esg_app.companies 구조 내보내기
CREATE TABLE IF NOT EXISTS `companies` (
  `company_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`company_id`),
  UNIQUE KEY `uq_company` (`company_name`),
  KEY `ix_companies_category` (`category_id`),
  CONSTRAINT `fk_company_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 esg_app.companies:~5 rows (대략적) 내보내기
INSERT INTO `companies` (`company_id`, `company_name`, `category_id`, `created_at`, `updated_at`) VALUES
	(1, '삼성중공업', 1, '2025-09-22 11:24:12', '2025-09-22 11:24:12'),
	(2, '현대중공업', 1, '2025-09-22 11:24:12', '2025-09-22 11:24:12'),
	(3, '대우조선해양', 1, '2025-09-22 11:24:12', '2025-09-22 11:24:12'),
	(4, '현대자동차', 2, '2025-09-22 11:24:12', '2025-09-22 11:24:12'),
	(5, '기아', 2, '2025-09-22 11:24:12', '2025-09-22 11:24:12');

-- 테이블 esg_app.positions 구조 내보내기
CREATE TABLE IF NOT EXISTS `positions` (
  `position_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_ko` varchar(50) NOT NULL,
  PRIMARY KEY (`position_id`),
  UNIQUE KEY `name_ko` (`name_ko`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 esg_app.positions:~6 rows (대략적) 내보내기
INSERT INTO `positions` (`position_id`, `name_ko`) VALUES
	(1, '사원'),
	(2, '대리'),
	(3, '과장'),
	(4, '차장'),
	(5, '부장'),
	(6, '임원');

-- 테이블 esg_app.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL,
  `password_hash` varchar(100) NOT NULL,
  `password_confirm_hash` varchar(100) NOT NULL,
  `company_id` int(11) NOT NULL,
  `gender` enum('M','F','N') NOT NULL DEFAULT 'N' COMMENT 'M=남성, F=여성, N=선택안함/기타',
  `position_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_login` (`login_id`),
  KEY `ix_users_company` (`company_id`),
  KEY `ix_users_position` (`position_id`),
  KEY `ix_users_login_like` (`login_id`),
  CONSTRAINT `fk_users_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_users_position` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ck_login_id_format` CHECK (char_length(`login_id`) between 4 and 30 and `login_id` regexp '^[A-Za-z0-9_]+$'),
  CONSTRAINT `ck_password_hash_len` CHECK (char_length(`password_hash`) >= 40),
  CONSTRAINT `ck_password_confirm_hash_len` CHECK (char_length(`password_confirm_hash`) >= 40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 esg_app.users:~0 rows (대략적) 내보내기

-- 뷰 esg_app.v_user_profiles 구조 내보내기
-- VIEW 종속성 오류를 극복하기 위해 임시 테이블을 생성합니다.
CREATE TABLE `v_user_profiles` (
	`user_id` BIGINT(20) NOT NULL,
	`login_id` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`gender_ko` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`position_ko` VARCHAR(1) NULL COLLATE 'utf8mb4_0900_ai_ci',
	`company_name` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`category_ko` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`is_active` TINYINT(1) NOT NULL,
	`created_at` DATETIME NOT NULL,
	`updated_at` DATETIME NOT NULL
);

-- 트리거 esg_app.trg_users_pw_equal_bi 구조 내보내기
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_users_pw_equal_bi
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF NEW.password_hash <> NEW.password_confirm_hash THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'password_hash and password_confirm_hash must be equal';
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- 트리거 esg_app.trg_users_pw_equal_bu 구조 내보내기
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER trg_users_pw_equal_bu
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.password_hash <> NEW.password_confirm_hash THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'password_hash and password_confirm_hash must be equal';
  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- 임시 테이블을 제거하고 최종 VIEW 구조를 생성
DROP TABLE IF EXISTS `v_user_profiles`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_user_profiles` AS SELECT
  u.user_id,
  u.login_id,
  CASE u.gender WHEN 'M' THEN '남성'
                WHEN 'F' THEN '여성'
                ELSE '선택안함/기타' END AS gender_ko,
  p.name_ko       AS position_ko,
  c.company_name,
  cat.name_ko     AS category_ko,
  u.is_active,
  u.created_at,
  u.updated_at
FROM users u
JOIN companies  c   ON c.company_id = u.company_id
JOIN categories cat ON cat.category_id = c.category_id
LEFT JOIN positions p ON p.position_id = u.position_id 
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
