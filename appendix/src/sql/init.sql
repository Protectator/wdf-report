ALTER TABLE `diagnosis` CHANGE `diagnosisList_id` `diagnosisList_id` SMALLINT(5) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `treatment` CHANGE `treatmentList_id` `treatmentList_id` SMALLINT(5) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE `diagnosis` CHANGE `last_update` `last_update` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `outcome` CHANGE `last_update` `last_update` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `patient` CHANGE `last_upate` `last_upate` TIMESTAMP on update CURRENT_TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `sCase` CHANGE `last_update` `last_update` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `treatment` CHANGE `last_update` `last_update` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- case_view_all : Toutes les informations relatives aux cas
CREATE
  ALGORITHM = UNDEFINED
VIEW `case_view_all` AS
  SELECT *
  FROM sCase
    LEFT JOIN
    (SELECT
       patient_id  AS patient_id,
       side        AS shoulder_side,
       shoulder_id AS shoulder_id_2
     FROM shoulder) AS shoulder ON shoulder_id = shoulder_id_2
    LEFT JOIN
    (SELECT
       patient_id AS patient_id_2,
       gender     AS patient_gender,
       birth_date AS patient_birth_date,
       height     AS patient_height,
       weight     AS patient_weight,
       last_upate AS patient_last_update
     FROM patient) AS patient ON patient_id = patient_id_2
    LEFT JOIN
    (SELECT
       treatmentList_id AS treatmentList_id,
       comment          AS treatment_comment,
       sCase_id         AS case_id_2,
       date             AS treatment_date,
       ASA              AS treatment_ASA,
       last_update      AS treatment_last_update
     FROM treatment) AS treatment ON case_id_2 = sCase_id
    LEFT JOIN
    (SELECT
       treatmentList_id AS treatmentList_id_2,
       name             AS treatmentList_name,
       description      AS treatmentList_description
     FROM treatmentList) AS treatmentList ON treatmentList_id = treatmentList_id_2
    LEFT JOIN
    (SELECT
       sCase_id         AS case_id_3,
       diagnosisList_id AS diagnosisList_id,
       date             AS diagnosis_date,
       comment          AS diagnosis_comment,
       CMI              AS diagnosis_CMI,
       DRG              AS diagnosis_DRG,
       last_update      AS diagnosis_last_update
     FROM diagnosis) AS diagnosis ON case_id_3 = sCase_id
    LEFT JOIN
    (SELECT
       diagnosisList_id AS diagnosisList_id_2,
       name             AS diagnosisList_name,
       description      AS diagnosisList_description
     FROM diagnosisList) AS diagnosisList ON diagnosisList_id = diagnosisList_id_2
    LEFT JOIN
    (SELECT
       outcome_id  AS outcome_id,
       sCase_id    AS case_id_4,
       loosening   AS outcome_loosening,
       comment     AS outcome_comment,
       date        AS outcome_date,
       score       AS outcome_score,
       last_update AS outcome_last_update
     FROM outcome) AS outcome ON case_id_4 = sCase_id;

-- patient_view_all : Toutes les informations relatives aux patients
CREATE
  ALGORITHM = UNDEFINED
VIEW `patient_view_all` AS
  SELECT *
  FROM patient
    LEFT JOIN
    (SELECT
       patient_id  AS patient_id_2,
       side        AS shoulder_side,
       shoulder_id AS shoulder_id_2
     FROM shoulder) AS shoulder ON patient_id = patient_id_2
    LEFT JOIN
    (SELECT
       patient_id AS patient_id_3,
       IPP        AS patient_IPP,
       initials   AS patient_initials
     FROM anonymity) AS anonymity ON patient_id = patient_id_3
    LEFT JOIN
    (SELECT
       sCase_id    AS sCase_id,
       shoulder_id AS shoulder_id,
       folder_name AS folder_name,
       last_update AS case_last_update
     FROM sCase) AS sCase ON shoulder_id = shoulder_id_2
    LEFT JOIN
    (SELECT
       treatmentList_id AS treatmentList_id,
       comment          AS treatment_comment,
       sCase_id         AS case_id_2,
       date             AS treatment_date,
       ASA              AS treatment_ASA,
       last_update      AS treatment_last_update
     FROM treatment) AS treatment ON case_id_2 = sCase_id
    LEFT JOIN
    (SELECT
       treatmentList_id AS treatmentList_id_2,
       name             AS treatmentList_name,
       description      AS treatmentList_description
     FROM treatmentList) AS treatmentList ON treatmentList_id = treatmentList_id_2
    LEFT JOIN
    (SELECT
       sCase_id         AS case_id_3,
       diagnosisList_id AS diagnosisList_id,
       date             AS diagnosis_date,
       comment          AS diagnosis_comment,
       CMI              AS diagnosis_CMI,
       DRG              AS diagnosis_DRG,
       last_update      AS diagnosis_last_update
     FROM diagnosis) AS diagnosis ON case_id_3 = sCase_id
    LEFT JOIN
    (SELECT
       diagnosisList_id AS diagnosisList_id_2,
       name             AS diagnosisList_name,
       description      AS diagnosisList_description
     FROM diagnosisList) AS diagnosisList ON diagnosisList_id = diagnosisList_id_2
    LEFT JOIN
    (SELECT
       outcome_id  AS outcome_id,
       sCase_id    AS case_id_4,
       loosening   AS outcome_loosening,
       comment     AS outcome_comment,
       date        AS outcome_date,
       score       AS outcome_score,
       last_update AS outcome_last_update
     FROM outcome) AS outcome ON case_id_4 = sCase_id;

-- ct_view : Toutes les informations relatives aux CT scans
CREATE
  ALGORITHM = UNDEFINED
VIEW `ct_view` AS
  SELECT *
  FROM sCase
    LEFT JOIN
    (SELECT
       patient_id  AS patient_id,
       side        AS shoulder_side,
       shoulder_id AS shoulder_id_2
     FROM shoulder) AS shoulder ON shoulder_id = shoulder_id_2
    LEFT JOIN
    (SELECT
       CT_id           AS CT_id,
       shoulder_id     AS shoulder_id_3,
       date            AS date,
       kernel          AS kernel,
       pixel_size      AS pixel_size,
       slice_spacing   AS slice_spacing,
       slice_thickness AS slice_thickness,
       tension         AS tension,
       current         AS current,
       manufacturer    AS manufacturer,
       model           AS model,
       institution     AS institution,
       folder_name     AS CT_folder_name,
       comment         AS comment,
       last_update     AS CT_last_update
     FROM CT) AS CT ON shoulder_id_2 = shoulder_id_3
    LEFT JOIN
    (SELECT
       CT_id    AS CT_id_2,
       CT_angle AS CT_angle
     FROM scapula) AS scapula ON CT_id_2 = CT.CT_id
    LEFT JOIN
    (SELECT
       CT_id          AS CT_id_3,
       radius         AS radius,
       sphericity     AS sphericity,
       biconcave      AS biconcave,
       depth          AS depth,
       width          AS width,
       height         AS height,
       version_amp    AS version_amp,
       version_orient AS version_orient,
       center_PA      AS center_PA,
       center_IS      AS center_IS,
       center_ML      AS center_ML,
       version        AS version,
       inclination    AS inclination,
       version_2D     AS version_2D,
       walch_class    AS walch_class
     FROM glenoid) AS glenoid ON CT_id_3 = CT.CT_id
    LEFT JOIN
    (SELECT
       CT_id AS CT_id_4,
       CO    AS CO,
       SC    AS SC,
       ST    AS ST,
       T1    AS T1,
       T2    AS T2,
       T3    AS T3,
       RE    AS RE
     FROM glenoid_density) AS glenoid_density ON CT_id_4 = CT.CT_id
    LEFT JOIN
    (SELECT
       CT_id AS CT_id_5,
       SSA   AS SSA,
       SSI   AS SSI,
       SSO   AS SSO,
       SSD   AS SSD,
       ISA   AS ISA,
       ISI   AS ISI,
       ISO   AS ISO,
       ISD   AS ISD,
       SCA   AS SCA,
       SCI   AS SCI,
       SCO   AS SCO,
       SCD   AS SCD,
       TMA   AS TMA,
       TMI   AS TMI,
       TMO   AS TMO,
       TMD   AS TMD
     FROM muscle) AS muscle ON CT_id_5 = CT.CT_id
    LEFT JOIN
    (SELECT
       CT_id           AS CT_id_6,
       joint_radius    AS joint_radius,
       head_radius     AS head_radius,
       SHsublux_ampl   AS SHsublux_ampl,
       SHsublux_orient AS SHsublux_orient,
       GHsublux_ampl   AS GHsublux_ampl,
       GHsublux_orient AS GHsublux_orient,
       SHsublux_2D     AS SHsublux_2D,
       GHsublux_2D     AS GHsublux_2D
     FROM humerus) AS humerus ON CT_id_6 = CT.CT_id;

DELIMITER //
CREATE PROCEDURE updateCase(
  IN case_id           SMALLINT(5),
  IN folder_name_new   VARCHAR(45),
  IN diag_index        SMALLINT(5),
  IN diag_comment      VARCHAR(255),
  IN diag_CMI          DECIMAL(4, 4),
  IN diag_DRG          VARCHAR(20),
  IN treat_index       SMALLINT(5),
  IN treat_comment     VARCHAR(255),
  IN treat_ASA         TINYINT(1),
  IN outcome_score     VARCHAR(45),
  IN outcome_comment   VARCHAR(255),
  IN outcome_loosening VARCHAR(1),
  IN diagnosis_date    DATE,
  IN treatment_date    DATE,
  IN outcome_date      DATE)
  BEGIN
    START TRANSACTION;

    IF NOT EXISTS (SELECT * FROM diagnosis WHERE sCase_id = case_id) THEN
      INSERT INTO diagnosis(sCase_id) VALUES (case_id);
    END IF;

    IF NOT EXISTS (SELECT * FROM treatment WHERE sCase_id = case_id) THEN
      INSERT INTO treatment(sCase_id) VALUES (case_id);
    END IF;

    IF NOT EXISTS (SELECT * FROM outcome WHERE sCase_id = case_id) THEN
      INSERT INTO outcome(sCase_id) VALUES (case_id);
    END IF;


    IF folder_name_new IS NOT NULL
    THEN
      UPDATE sCase
      SET folder_name = folder_name_new
      WHERE sCase.sCase_id = case_id;
    END IF;

    IF diag_index IS NOT NULL
    THEN
      UPDATE diagnosis
      SET diagnosisList_id = diag_index
      WHERE diagnosis.sCase_id = case_id;
    END IF;

    IF diag_comment IS NOT NULL
    THEN
      UPDATE diagnosis
      SET comment = diag_comment
      WHERE diagnosis.sCase_id = case_id;
    END IF;

    IF diag_CMI IS NOT NULL
    THEN
      UPDATE diagnosis
      SET CMI = diag_CMI
      WHERE diagnosis.sCase_id = case_id;
    END IF;

    IF diag_DRG IS NOT NULL
    THEN
      UPDATE diagnosis
      SET DRG = diag_DRG
      WHERE diagnosis.sCase_id = case_id;
    END IF;

    IF treat_index IS NOT NULL
    THEN
      UPDATE treatment
      SET treatmentList_id = treat_index
      WHERE treatment.sCase_id = case_id;
    END IF;

    IF treat_comment IS NOT NULL
    THEN
      UPDATE treatment
      SET comment = treat_comment
      WHERE treatment.sCase_id = case_id;
    END IF;

    IF treat_ASA IS NOT NULL
    THEN
      UPDATE treatment
      SET ASA = treat_ASA
      WHERE treatment.sCase_id = case_id;
    END IF;

    IF outcome_score IS NOT NULL
    THEN
      UPDATE outcome
      SET score = outcome_score
      WHERE outcome.sCase_id = case_id;
    END IF;

    IF outcome_comment IS NOT NULL
    THEN
      UPDATE outcome
      SET comment = outcome_comment
      WHERE outcome.sCase_id = case_id;
    END IF;

    IF outcome_loosening IS NOT NULL
    THEN
      UPDATE outcome
      SET loosening = outcome_loosening
      WHERE outcome.sCase_id = case_id;
    END IF;

    IF diagnosis_date IS NOT NULL
    THEN
      UPDATE diagnosis
      SET date = diagnosis_date
      WHERE diagnosis.sCase_id = case_id;
    END IF;

    IF treatment_date IS NOT NULL
    THEN
      UPDATE treatment
      SET date = treatment_date
      WHERE treatment.sCase_id = case_id;
    END IF;

    IF outcome_date IS NOT NULL
    THEN
      UPDATE outcome
      SET date = outcome_date
      WHERE outcome.sCase_id = case_id;
    END IF;
    COMMIT;
  END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE updatePatient(
  IN patient_id        SMALLINT(5),
  IN gender            ENUM('M', 'F'),
  IN birth_date        DATE,
  IN weight            DECIMAL(4, 1),
  IN height            DECIMAL(4, 1),
  IN ipp               INT(11),
  IN initials          VARCHAR(5))
  BEGIN
    START TRANSACTION;

    IF gender IS NOT NULL
    THEN
      UPDATE patient
      SET patient.gender = gender
      WHERE patient.patient_id = patient_id;
    END IF;

    IF birth_date IS NOT NULL
    THEN
      UPDATE patient
      SET patient.birth_date = birth_date
      WHERE patient.patient_id = patient_id;
    END IF;

    IF weight IS NOT NULL
    THEN
      UPDATE patient
      SET patient.weight = weight
      WHERE patient.patient_id = patient_id;
    END IF;

    IF height IS NOT NULL
    THEN
      UPDATE patient
      SET patient.height = height
      WHERE patient.patient_id = patient_id;
    END IF;

    IF ipp IS NOT NULL
    THEN
      UPDATE anonymity
      SET anonymity.IPP = ipp
      WHERE anonymity.patient_id = patient_id;
    END IF;

    IF initials IS NOT NULL
    THEN
      UPDATE anonymity
      SET anonymity.initials = initials
      WHERE anonymity.patient_id = patient_id;
    END IF;

    COMMIT;
  END //
DELIMITER ;