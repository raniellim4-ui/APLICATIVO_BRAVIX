import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../data-source';
import {
  User,
  Vehicle,
  Driver,
  Inspection,
  MaintenanceSchedule,
} from '../entities';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const vehicleRepository = dataSource.getRepository(Vehicle);
  const driverRepository = dataSource.getRepository(Driver);
  const inspectionRepository = dataSource.getRepository(Inspection);
  const maintenanceRepository =
    dataSource.getRepository(MaintenanceSchedule);

  // Seed de usuários — idempotência própria (independente dos veículos),
  // pois a autenticação agora usa o banco.
  const userCount = await userRepository.count();
  if (userCount === 0) {
    const adminPassword = await bcrypt.hash('Admin@123456', 10);
    const managerPassword = await bcrypt.hash('Manager@123456', 10);
    const driverPassword = await bcrypt.hash('Driver@123456', 10);

    const admin = userRepository.create({
      name: 'Usuário Administrador',
      email: 'admin@vehicleinspection.com',
      passwordHash: adminPassword,
      role: 'admin',
      phone: '11 99999-9999',
    });

    const manager = userRepository.create({
      name: 'Gestor de Frota',
      email: 'manager@vehicleinspection.com',
      passwordHash: managerPassword,
      role: 'manager',
      phone: '11 99999-8888',
    });

    const driver = userRepository.create({
      name: 'João Motorista',
      email: 'driver@vehicleinspection.com',
      passwordHash: driverPassword,
      role: 'driver',
      phone: '11 99999-7777',
    });

    await userRepository.save([admin, manager, driver]);
    console.log('✅ Usuários de acesso criados (admin/manager/driver).');
  } else {
    console.log(`ℹ️  Usuários já existem (${userCount}); seed de usuários ignorado.`);
  }

  // Idempotência: não duplicar o restante se já houver veículos
  const existing = await vehicleRepository.count();
  if (existing > 0) {
    console.log(
      `ℹ️  Seed de frota ignorado: já existem ${existing} veículo(s) no banco.`,
    );
    return;
  }

  const companyId = uuidv4();

  // Criar veículos
  const vehicle1 = vehicleRepository.create({
    companyId,
    plate: 'ABC-1234',
    crlvNumber: '1234567890',
    renavam: '12345678901',
    model: 'Volvo FH16',
    make: 'Volvo',
    year: 2023,
    vin: 'YV2FM02G8F1234567',
    registrationDate: new Date('2023-01-15'),
    currentKm: 45000,
    healthScore: 94,
    lastInspectionAt: new Date(),
    purchasePrice: 350000,
    expectedLifespanYears: 10,
  });

  const vehicle2 = vehicleRepository.create({
    companyId,
    plate: 'XYZ-5678',
    crlvNumber: '9876543210',
    renavam: '98765432101',
    model: 'Scania R450',
    make: 'Scania',
    year: 2022,
    vin: 'XSC95DXP1GJ245680',
    registrationDate: new Date('2022-06-20'),
    currentKm: 78000,
    healthScore: 87,
    lastInspectionAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    purchasePrice: 380000,
    expectedLifespanYears: 10,
  });

  const vehicle3 = vehicleRepository.create({
    companyId,
    plate: 'BRA-2E19',
    crlvNumber: '4567891230',
    renavam: '45678912301',
    model: 'Mercedes-Benz Actros',
    make: 'Mercedes-Benz',
    year: 2024,
    vin: 'WDB9634031L987654',
    registrationDate: new Date('2024-02-10'),
    currentKm: 12000,
    healthScore: 98,
    lastInspectionAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    purchasePrice: 420000,
    expectedLifespanYears: 12,
  });

  const vehicle4 = vehicleRepository.create({
    companyId,
    plate: 'DEF-9090',
    crlvNumber: '3216549870',
    renavam: '32165498701',
    model: 'Iveco Tector',
    make: 'Iveco',
    year: 2021,
    vin: 'ZCFC65A0005123456',
    registrationDate: new Date('2021-09-05'),
    currentKm: 134500,
    healthScore: 72,
    lastInspectionAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    purchasePrice: 290000,
    expectedLifespanYears: 10,
  });

  const vehicle5 = vehicleRepository.create({
    companyId,
    plate: 'GHI-3344',
    crlvNumber: '7418529630',
    renavam: '74185296301',
    model: 'Volkswagen Constellation',
    make: 'Volkswagen',
    year: 2020,
    vin: '9532E82W3LR456789',
    registrationDate: new Date('2020-03-18'),
    currentKm: 198700,
    healthScore: 64,
    lastInspectionAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    purchasePrice: 260000,
    expectedLifespanYears: 9,
  });

  await vehicleRepository.save([
    vehicle1,
    vehicle2,
    vehicle3,
    vehicle4,
    vehicle5,
  ]);

  // Criar motoristas
  const driver1 = driverRepository.create({
    companyId,
    name: 'João Silva',
    cnh: '12345678901',
    cnhExpiration: new Date('2028-06-15'),
    phone: '11 99999-8888',
    email: 'joao@example.com',
    totalKm: 125000,
    fuelExpense: 8500,
    fuelEfficiency: 4.5,
    inspectionQualityScore: 4.8,
    avgInspectionTimeMinutes: 18,
    inspectionsCompleted: 156,
  });

  const driver2 = driverRepository.create({
    companyId,
    name: 'Maria Santos',
    cnh: '98765432101',
    cnhExpiration: new Date('2027-12-10'),
    phone: '11 98888-7777',
    email: 'maria@example.com',
    totalKm: 205000,
    fuelExpense: 14200,
    fuelEfficiency: 4.2,
    inspectionQualityScore: 4.6,
    avgInspectionTimeMinutes: 20,
    inspectionsCompleted: 234,
  });

  await driverRepository.save([driver1, driver2]);

  // Criar inspeções
  const inspection1 = inspectionRepository.create({
    vehicleId: vehicle1.id,
    driverId: driver1.id,
    inspectionDate: new Date(),
    inspectionType: 'pre_trip',
    status: 'completed',
    aiAnalysisStatus: 'completed',
    locationCity: 'São Paulo',
    locationCountry: 'Brasil',
    durationMinutes: 18,
    totalPhotos: 6,
    aiQualityScore: 0.94,
    damageCount: 0,
    newDamages: 0,
    odometerReading: 45000,
    odometerVerified: true,
  });

  await inspectionRepository.save(inspection1);

  // Criar agendamentos de manutenção
  const maintenance1 = maintenanceRepository.create({
    vehicleId: vehicle1.id,
    maintenanceType: 'oil_change',
    component: 'Óleo do motor',
    recommendedKm: 10000,
    alertThresholdKm: 9000,
    nextDueKm: 50000,
    nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    lastPerformedKm: 40000,
    lastPerformedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  });

  const maintenance2 = maintenanceRepository.create({
    vehicleId: vehicle1.id,
    maintenanceType: 'tire_rotation',
    component: 'Pneus',
    recommendedKm: 20000,
    alertThresholdKm: 18000,
    nextDueKm: 60000,
    nextDueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    lastPerformedKm: 40000,
    lastPerformedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
  });

  await maintenanceRepository.save([maintenance1, maintenance2]);

  console.log('✅ Banco de dados populado com sucesso!');
}

// Runner: executa o seed quando o arquivo é chamado diretamente
if (require.main === module) {
  AppDataSource.initialize()
    .then(async (dataSource) => {
      await seedDatabase(dataSource);
      await dataSource.destroy();
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Falha ao executar o seed:', err);
      process.exit(1);
    });
}
