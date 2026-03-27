'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  User,
  MapPin,
  Heart,
  Edit3,
  Save,
  Plus,
  Trash2,
  X,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { Address } from '@/types'

// Mock user data when no auth
const mockUser = {
  id: 'mock-1',
  email: 'joao@email.com',
  full_name: 'Joao Silva',
  phone: '11999887766',
  cpf: '12345678901',
  avatar_url: null,
  role: 'customer' as const,
  addresses: [
    {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'Sao Paulo',
      state: 'SP',
      zip_code: '01001000',
      country: 'BR',
    },
  ],
  created_at: '2024-01-01',
}

const navCards = [
  {
    href: '/conta/pedidos',
    label: 'Meus Pedidos',
    description: 'Acompanhe seus pedidos e historico',
    icon: ShoppingBag,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  {
    href: '#perfil',
    label: 'Meus Dados',
    description: 'Edite suas informacoes pessoais',
    icon: User,
    color: 'from-primary-500 to-accent-500',
    glow: 'shadow-primary-500/20',
  },
  {
    href: '#enderecos',
    label: 'Enderecos',
    description: 'Gerencie seus enderecos de entrega',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    href: '#favoritos',
    label: 'Favoritos',
    description: 'Produtos salvos para mais tarde',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function AccountPage() {
  const { user } = useAuthStore()
  const currentUser = user || mockUser

  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    full_name: currentUser.full_name,
    email: currentUser.email,
    phone: currentUser.phone || '',
  })

  const [addresses, setAddresses] = useState<Address[]>(currentUser.addresses)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressIdx, setEditingAddressIdx] = useState<number | null>(null)
  const [addressForm, setAddressForm] = useState<Address>({
    street: '',
    number: '',
    complement: null,
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'BR',
  })

  const handleSaveProfile = () => {
    // In production: API call to update user profile
    setIsEditing(false)
  }

  const handleAddAddress = () => {
    if (editingAddressIdx !== null) {
      const updated = [...addresses]
      updated[editingAddressIdx] = addressForm
      setAddresses(updated)
      setEditingAddressIdx(null)
    } else {
      setAddresses([...addresses, addressForm])
    }
    setAddressForm({
      street: '',
      number: '',
      complement: null,
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'BR',
    })
    setShowAddressForm(false)
  }

  const handleEditAddress = (idx: number) => {
    setAddressForm(addresses[idx])
    setEditingAddressIdx(idx)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = (idx: number) => {
    setAddresses(addresses.filter((_, i) => i !== idx))
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-100">
          Ola,{' '}
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            {currentUser.full_name.split(' ')[0]}
          </span>
          !
        </h1>
        <p className="text-dark-400 mt-1 text-sm">
          Gerencie sua conta e acompanhe seus pedidos
        </p>
      </motion.div>

      {/* Navigation Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {navCards.map((card) => {
          const isLink = card.href.startsWith('/')
          const Wrapper = isLink ? Link : 'a'

          return (
            <Wrapper
              key={card.label}
              href={card.href}
              className={cn(
                'group relative rounded-2xl p-4 sm:p-5',
                'bg-dark-900/60 backdrop-blur-xl',
                'border border-dark-700/50',
                'hover:border-dark-600 hover:shadow-lg',
                `hover:${card.glow}`,
                'transition-all duration-300 cursor-pointer'
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-xl flex items-center justify-center mb-3',
                  'bg-gradient-to-br',
                  card.color,
                  'shadow-lg'
                )}
              >
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-dark-100 group-hover:text-white transition-colors">
                {card.label}
              </h3>
              <p className="text-xs text-dark-500 mt-0.5 hidden sm:block">
                {card.description}
              </p>
              {isLink && (
                <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-dark-600 group-hover:text-dark-400 transition-colors" />
              )}
            </Wrapper>
          )
        })}
      </motion.div>

      {/* Profile Section */}
      <motion.section variants={itemVariants} id="perfil">
        <div
          className={cn(
            'rounded-2xl p-6',
            'bg-dark-900/60 backdrop-blur-xl',
            'border border-dark-700/50'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-dark-100">
              Dados Pessoais
            </h2>
            <Button
              variant={isEditing ? 'outline' : 'ghost'}
              size="sm"
              icon={isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Input
                label="Nome completo"
                icon={<User className="h-4 w-4" />}
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, full_name: e.target.value })
                }
              />
              <Input
                label="E-mail"
                type="email"
                icon={<Mail className="h-4 w-4" />}
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
              />
              <Input
                label="Telefone"
                icon={<Phone className="h-4 w-4" />}
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, phone: e.target.value })
                }
                placeholder="(11) 99999-9999"
              />
              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={<Save className="h-4 w-4" />}
                  onClick={handleSaveProfile}
                >
                  Salvar Alteracoes
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-dark-500 uppercase tracking-wider">
                  Nome
                </p>
                <p className="text-sm text-dark-200">{currentUser.full_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-dark-500 uppercase tracking-wider">
                  E-mail
                </p>
                <p className="text-sm text-dark-200">{currentUser.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-dark-500 uppercase tracking-wider">
                  Telefone
                </p>
                <p className="text-sm text-dark-200">
                  {currentUser.phone || 'Nao informado'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-dark-500 uppercase tracking-wider">
                  CPF
                </p>
                <p className="text-sm text-dark-200">
                  {currentUser.cpf
                    ? currentUser.cpf.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        '$1.$2.$3-$4'
                      )
                    : 'Nao informado'}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* Addresses Section */}
      <motion.section variants={itemVariants} id="enderecos">
        <div
          className={cn(
            'rounded-2xl p-6',
            'bg-dark-900/60 backdrop-blur-xl',
            'border border-dark-700/50'
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-dark-100">Enderecos</h2>
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => {
                setEditingAddressIdx(null)
                setAddressForm({
                  street: '',
                  number: '',
                  complement: null,
                  neighborhood: '',
                  city: '',
                  state: '',
                  zip_code: '',
                  country: 'BR',
                })
                setShowAddressForm(true)
              }}
            >
              Adicionar
            </Button>
          </div>

          {/* Address List */}
          <div className="space-y-3">
            {addresses.length === 0 && !showAddressForm && (
              <p className="text-sm text-dark-500 text-center py-8">
                Nenhum endereco cadastrado
              </p>
            )}
            {addresses.map((addr, idx) => (
              <motion.div
                key={idx}
                layout
                className={cn(
                  'flex items-start justify-between gap-4 p-4 rounded-xl',
                  'bg-dark-800/40 border border-dark-700/30',
                  'hover:border-dark-600/50 transition-colors'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <MapPin className="h-4 w-4 text-primary-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-dark-300 min-w-0">
                    <p className="truncate">
                      {addr.street}, {addr.number}
                      {addr.complement ? ` - ${addr.complement}` : ''}
                    </p>
                    <p className="text-dark-500 text-xs mt-0.5">
                      {addr.neighborhood} - {addr.city}/{addr.state} -{' '}
                      {addr.zip_code.replace(/(\d{5})(\d{3})/, '$1-$2')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEditAddress(idx)}
                    className="p-1.5 rounded-lg text-dark-500 hover:text-primary-400 hover:bg-dark-700/50 transition-colors"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Address Form */}
          <AnimatePresence>
            {showAddressForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 rounded-xl bg-dark-800/40 border border-dark-700/30 space-y-3">
                  <h3 className="text-sm font-medium text-dark-200 mb-3">
                    {editingAddressIdx !== null
                      ? 'Editar Endereco'
                      : 'Novo Endereco'}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Rua"
                      value={addressForm.street}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, street: e.target.value })
                      }
                      containerClassName="sm:col-span-2"
                    />
                    <Input
                      label="Numero"
                      value={addressForm.number}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, number: e.target.value })
                      }
                    />
                    <Input
                      label="Complemento"
                      value={addressForm.complement || ''}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          complement: e.target.value || null,
                        })
                      }
                    />
                    <Input
                      label="Bairro"
                      value={addressForm.neighborhood}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          neighborhood: e.target.value,
                        })
                      }
                    />
                    <Input
                      label="Cidade"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                    />
                    <Input
                      label="Estado"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                    />
                    <Input
                      label="CEP"
                      value={addressForm.zip_code}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          zip_code: e.target.value,
                        })
                      }
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddressForm(false)
                        setEditingAddressIdx(null)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Save className="h-3.5 w-3.5" />}
                      onClick={handleAddAddress}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </motion.div>
  )
}
