'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User, MapPin, CreditCard, ClipboardCheck, ChevronRight, ChevronLeft,
  Loader2, QrCode, Copy, CheckCircle2, ShieldCheck, Lock, Barcode,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cart-store'
import { formatCurrency, validateCPF, maskCEP } from '@/lib/utils'

// ── Schemas ──────────────────────────────────────────────────────────

const identificationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(14, 'Telefone inválido'),
  cpf: z.string().min(14, 'CPF inválido').refine((v) => validateCPF(v), 'CPF inválido'),
})

const addressSchema = z.object({
  cep: z.string().min(9, 'CEP inválido'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  sameForBilling: z.boolean().optional(),
})

const paymentSchema = z.object({
  method: z.enum(['pix', 'credit_card', 'boleto']),
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
})

type IdentificationData = z.infer<typeof identificationSchema>
type AddressData = z.infer<typeof addressSchema>
type PaymentData = z.infer<typeof paymentSchema>

// ── Masks ────────────────────────────────────────────────────────────

function phoneMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function cpfMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function cepMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length > 5) return `${d.slice(0, 5)}-${d.slice(5)}`
  return d
}

function cardNumberMask(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function cardExpiryMask(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`
  return d
}

// ── Steps Config ─────────────────────────────────────────────────────

const steps = [
  { id: 1, label: 'Identificação', icon: User },
  { id: 2, label: 'Endereço', icon: MapPin },
  { id: 3, label: 'Pagamento', icon: CreditCard },
  { id: 4, label: 'Revisão', icon: ClipboardCheck },
]

const PIX_DISCOUNT = 0.10
const MOCK_PIX_CODE = '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.905802BR5925VAPOCRIA LTDA6009SAO PAULO62070503***6304B13F'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getItemCount, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)

  const [identificationData, setIdentificationData] = useState<IdentificationData | null>(null)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)

  const subtotal = getSubtotal()
  const shipping = 18.90
  const paymentMethod = paymentData?.method || 'pix'
  const discount = paymentMethod === 'pix' ? subtotal * PIX_DISCOUNT : 0
  const total = subtotal + shipping - discount

  // ── Step 1: Identification ──────────────────────────────────────

  const IdentificationStep = () => {
    const {
      register, handleSubmit, setValue, formState: { errors },
    } = useForm<IdentificationData>({
      resolver: zodResolver(identificationSchema),
      defaultValues: identificationData || {},
    })

    return (
      <motion.form
        key="step-1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit((data) => {
          setIdentificationData(data)
          setCurrentStep(2)
        })}
        className="space-y-5"
      >
        <h2 className="text-xl font-bold text-white mb-2">Identificação</h2>
        <p className="text-sm text-dark-400 mb-6">Preencha seus dados para continuar</p>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Nome Completo</label>
          <input {...register('name')} placeholder="Seu nome completo" className="input-field" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
          <input type="email" {...register('email')} placeholder="seu@email.com" className="input-field" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Telefone</label>
          <input
            type="tel"
            {...register('phone')}
            onChange={(e) => setValue('phone', phoneMask(e.target.value), { shouldValidate: true })}
            placeholder="(00) 00000-0000"
            className="input-field"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">CPF</label>
          <input
            {...register('cpf')}
            onChange={(e) => setValue('cpf', cpfMask(e.target.value), { shouldValidate: true })}
            placeholder="000.000.000-00"
            className="input-field"
          />
          {errors.cpf && <p className="text-red-400 text-xs mt-1">{errors.cpf.message}</p>}
        </div>

        <p className="text-xs text-dark-500">
          Já tem conta?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300">Faça login</Link>
        </p>

        <div className="flex justify-end pt-4">
          <button type="submit" className="btn-primary flex items-center gap-2">
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.form>
    )
  }

  // ── Step 2: Address ─────────────────────────────────────────────

  const AddressStep = () => {
    const {
      register, handleSubmit, setValue, watch, formState: { errors },
    } = useForm<AddressData>({
      resolver: zodResolver(addressSchema),
      defaultValues: addressData || { sameForBilling: true },
    })

    const handleCepLookup = useCallback(async (cepValue: string) => {
      const clean = cepValue.replace(/\D/g, '')
      if (clean.length !== 8) return
      setLoadingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setValue('street', data.logradouro || '', { shouldValidate: true })
          setValue('neighborhood', data.bairro || '', { shouldValidate: true })
          setValue('city', data.localidade || '', { shouldValidate: true })
          setValue('state', data.uf || '', { shouldValidate: true })
          toast.success('Endereço encontrado!')
        } else {
          toast.error('CEP não encontrado')
        }
      } catch {
        toast.error('Erro ao buscar CEP')
      }
      setLoadingCep(false)
    }, [setValue])

    return (
      <motion.form
        key="step-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit((data) => {
          setAddressData(data)
          setCurrentStep(3)
        })}
        className="space-y-5"
      >
        <h2 className="text-xl font-bold text-white mb-2">Endereço de Entrega</h2>
        <p className="text-sm text-dark-400 mb-6">Informe o endereço para receber seu pedido</p>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">CEP</label>
          <div className="flex gap-2">
            <input
              {...register('cep')}
              onChange={(e) => {
                const masked = cepMask(e.target.value)
                setValue('cep', masked, { shouldValidate: true })
                if (masked.replace(/\D/g, '').length === 8) handleCepLookup(masked)
              }}
              placeholder="00000-000"
              className="input-field flex-1"
              maxLength={9}
            />
            {loadingCep && <Loader2 className="w-5 h-5 animate-spin text-primary-400 mt-3" />}
          </div>
          {errors.cep && <p className="text-red-400 text-xs mt-1">{errors.cep.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Rua</label>
          <input {...register('street')} placeholder="Rua, Avenida..." className="input-field" />
          {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Número</label>
            <input {...register('number')} placeholder="123" className="input-field" />
            {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number.message}</p>}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Complemento</label>
            <input {...register('complement')} placeholder="Apto, Bloco..." className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Bairro</label>
          <input {...register('neighborhood')} placeholder="Bairro" className="input-field" />
          {errors.neighborhood && <p className="text-red-400 text-xs mt-1">{errors.neighborhood.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Cidade</label>
            <input {...register('city')} placeholder="Cidade" className="input-field" />
            {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">Estado</label>
            <input {...register('state')} placeholder="UF" className="input-field" maxLength={2} />
            {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('sameForBilling')}
            className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/50"
          />
          <span className="text-sm text-dark-400">Usar mesmo endereço para cobrança</span>
        </label>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={() => setCurrentStep(1)} className="btn-secondary flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          <button type="submit" className="btn-primary flex items-center gap-2">
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.form>
    )
  }

  // ── Step 3: Payment ─────────────────────────────────────────────

  const PaymentStep = () => {
    const {
      register, handleSubmit, setValue, watch, formState: { errors },
    } = useForm<PaymentData>({
      resolver: zodResolver(paymentSchema),
      defaultValues: paymentData || { method: 'pix' },
    })

    const method = watch('method')

    const paymentMethods = [
      {
        id: 'pix' as const,
        label: 'PIX',
        description: 'Aprovação instantânea',
        badge: '10% OFF',
        icon: QrCode,
      },
      {
        id: 'credit_card' as const,
        label: 'Cartão de Crédito',
        description: 'Até 12x sem juros',
        badge: null,
        icon: CreditCard,
      },
      {
        id: 'boleto' as const,
        label: 'Boleto Bancário',
        description: '1-3 dias para compensar',
        badge: null,
        icon: Barcode,
      },
    ]

    return (
      <motion.form
        key="step-3"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit((data) => {
          setPaymentData(data)
          setCurrentStep(4)
        })}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold text-white mb-2">Pagamento</h2>
        <p className="text-sm text-dark-400 mb-6">Escolha a forma de pagamento</p>

        {/* Method Selection */}
        <div className="grid gap-3">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setValue('method', pm.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                method === pm.id
                  ? 'border-primary-500/50 bg-primary-500/10 neon-border'
                  : 'border-dark-600 bg-dark-800/60 hover:border-dark-500'
              }`}
            >
              <pm.icon className={`w-6 h-6 ${method === pm.id ? 'text-primary-400' : 'text-dark-400'}`} />
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{pm.label}</p>
                <p className="text-xs text-dark-400">{pm.description}</p>
              </div>
              {pm.badge && (
                <span className="text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                  {pm.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PIX Content */}
        <AnimatePresence mode="wait">
          {method === 'pix' && (
            <motion.div
              key="pix"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl p-6 text-center space-y-4"
            >
              <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center">
                <QrCode className="w-28 h-28 text-dark-900" />
              </div>
              <p className="text-sm text-dark-400">Escaneie o QR Code ou copie o código abaixo</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={MOCK_PIX_CODE.slice(0, 40) + '...'}
                  className="input-field text-xs flex-1 truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(MOCK_PIX_CODE)
                    toast.success('Código PIX copiado!')
                  }}
                  className="btn-secondary flex items-center gap-1 text-xs py-3 px-3"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </button>
              </div>
              <p className="text-xs text-green-400 font-medium">
                Desconto de 10% aplicado automaticamente
              </p>
            </motion.div>
          )}

          {/* Credit Card */}
          {method === 'credit_card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Número do Cartão</label>
                <input
                  {...register('cardNumber')}
                  onChange={(e) => setValue('cardNumber', cardNumberMask(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="input-field"
                  maxLength={19}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1.5">Nome no Cartão</label>
                <input
                  {...register('cardName')}
                  placeholder="Como está no cartão"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">Validade</label>
                  <input
                    {...register('cardExpiry')}
                    onChange={(e) => setValue('cardExpiry', cardExpiryMask(e.target.value))}
                    placeholder="MM/AA"
                    className="input-field"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-1.5">CVV</label>
                  <input
                    {...register('cardCvv')}
                    onChange={(e) => setValue('cardCvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="000"
                    className="input-field"
                    maxLength={4}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Boleto */}
          {method === 'boleto' && (
            <motion.div
              key="boleto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-xl p-6 text-center space-y-3"
            >
              <Barcode className="w-12 h-12 text-primary-400 mx-auto" />
              <p className="text-sm text-white font-medium">Boleto Bancário</p>
              <p className="text-xs text-dark-400">
                O boleto será gerado após a confirmação do pedido.
                Pagamento pode levar até 3 dias úteis para compensar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={() => setCurrentStep(2)} className="btn-secondary flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          <button type="submit" className="btn-primary flex items-center gap-2">
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.form>
    )
  }

  // ── Step 4: Review ──────────────────────────────────────────────

  const ReviewStep = () => {
    const handleConfirm = async () => {
      setIsSubmitting(true)
      await new Promise((r) => setTimeout(r, 2000))
      clearCart()
      setIsSubmitting(false)
      router.push('/checkout/sucesso')
    }

    return (
      <motion.div
        key="step-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-bold text-white mb-2">Revisão do Pedido</h2>
        <p className="text-sm text-dark-400 mb-6">Confirme todos os dados antes de finalizar</p>

        {/* Items */}
        <div className="glass rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Itens</h3>
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-dark-700/50 last:border-0">
              <div className="w-12 h-12 rounded-lg bg-dark-800 overflow-hidden relative flex-shrink-0">
                <Image
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-dark-400">Qtd: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(item.product.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Customer Info */}
        {identificationData && (
          <div className="glass rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Dados do Cliente</h3>
            <p className="text-sm text-white">{identificationData.name}</p>
            <p className="text-xs text-dark-400">{identificationData.email}</p>
            <p className="text-xs text-dark-400">{identificationData.phone}</p>
          </div>
        )}

        {/* Address */}
        {addressData && (
          <div className="glass rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Endereço de Entrega</h3>
            <p className="text-sm text-white">
              {addressData.street}, {addressData.number}
              {addressData.complement ? ` - ${addressData.complement}` : ''}
            </p>
            <p className="text-xs text-dark-400">
              {addressData.neighborhood} - {addressData.city}/{addressData.state}
            </p>
            <p className="text-xs text-dark-400">CEP: {addressData.cep}</p>
          </div>
        )}

        {/* Payment */}
        {paymentData && (
          <div className="glass rounded-xl p-4 space-y-2">
            <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">Pagamento</h3>
            <p className="text-sm text-white">
              {paymentData.method === 'pix' && 'PIX (10% de desconto)'}
              {paymentData.method === 'credit_card' && `Cartão de Crédito **** ${paymentData.cardNumber?.slice(-4) || '****'}`}
              {paymentData.method === 'boleto' && 'Boleto Bancário'}
            </p>
          </div>
        )}

        {/* Totals */}
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-dark-400">Subtotal</span>
            <span className="text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-dark-400">Frete</span>
            <span className="text-white">{formatCurrency(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Desconto PIX</span>
              <span className="text-green-400">-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="border-t border-dark-700/50 pt-2 flex justify-between">
            <span className="font-semibold text-white">Total</span>
            <span className="text-xl font-bold gradient-text">{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={() => setCurrentStep(3)} className="btn-secondary flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center gap-2 min-w-[200px] py-3.5 text-base font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                CONFIRMAR PEDIDO
              </>
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  // ── Redirect if cart empty ──────────────────────────────────────

  if (items.length === 0 && currentStep !== 4) {
    return (
      <div className="section-padding py-20 text-center">
        <p className="text-dark-400 mb-4">Seu carrinho está vazio</p>
        <Link href="/produtos" className="btn-primary">Ir às Compras</Link>
      </div>
    )
  }

  // ── Main Render ─────────────────────────────────────────────────

  return (
    <div className="section-padding py-8 md:py-12">
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/25'
                      : 'bg-dark-800 text-dark-500 border border-dark-600'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-primary-400' : 'text-dark-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-20 md:w-28 h-0.5 mx-2 transition-all duration-500 ${
                    currentStep > step.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                      : 'bg-dark-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-6 md:p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <IdentificationStep />}
              {currentStep === 2 && <AddressStep />}
              {currentStep === 3 && <PaymentStep />}
              {currentStep === 4 && <ReviewStep />}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-dark-300 uppercase tracking-wider mb-4">
                Resumo ({getItemCount()} itens)
              </h3>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-dark-800 overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-dark-500">{item.quantity}x {formatCurrency(item.product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-700/50 pt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-dark-400">Frete</span>
                  <span className="text-white">{formatCurrency(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Desconto PIX</span>
                    <span className="text-green-400">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="border-t border-dark-700/50 pt-2 flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">Total</span>
                  <span className="text-lg font-bold gradient-text">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-700/50 flex items-center justify-center gap-3 text-dark-500">
                <Lock className="w-3.5 h-3.5 text-green-400" />
                <span className="text-[10px]">Compra 100% Segura</span>
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
