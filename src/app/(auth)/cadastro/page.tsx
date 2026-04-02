'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, User, Mail, Phone, FileText, Lock, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth-store'
import { validateCPF } from '@/lib/utils'

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
    email: z.string().email('Email invalido'),
    phone: z.string().min(14, 'Telefone invalido'),
    cpf: z.string().min(14, 'CPF invalido').refine(
      (val) => validateCPF(val),
      'CPF invalido'
    ),
    password: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, 'Voce deve aceitar os termos'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas nao conferem',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function applyCPFMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export default function CadastroPage() {
  const router = useRouter()
  const { setUser, setLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUser({
      id: 'user-new',
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      cpf: data.cpf,
      avatar_url: null,
      role: 'customer',
      addresses: [],
      created_at: new Date().toISOString(),
    })

    setLoading(false)
    setIsSubmitting(false)
    toast.success('Conta criada com sucesso!')
    router.push('/')
  }

  const inputFields = [
    {
      name: 'fullName' as const,
      label: 'Nome Completo',
      type: 'text',
      placeholder: 'Seu nome completo',
      icon: User,
      autoComplete: 'name',
    },
    {
      name: 'email' as const,
      label: 'Email',
      type: 'email',
      placeholder: 'seu@email.com',
      icon: Mail,
      autoComplete: 'email',
    },
    {
      name: 'phone' as const,
      label: 'Telefone',
      type: 'tel',
      placeholder: '(00) 00000-0000',
      icon: Phone,
      autoComplete: 'tel',
      mask: applyPhoneMask,
    },
    {
      name: 'cpf' as const,
      label: 'CPF',
      type: 'text',
      placeholder: '000.000.000-00',
      icon: FileText,
      autoComplete: 'off',
      mask: applyCPFMask,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="glass rounded-3xl p-8 md:p-10 shadow-card">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <h1 className="font-display text-4xl font-bold gradient-text tracking-wider">
              DECRIA
            </h1>
            <p className="text-sm font-heading text-brand-gold tracking-[0.3em] mt-1 uppercase">
              Outlet
            </p>
          </Link>
          <p className="text-dark-400 text-sm mt-3">
            Crie sua conta e aproveite as ofertas
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {inputFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <label className="block text-sm font-medium text-dark-300 mb-1.5">
                {field.label}
              </label>
              <div className="relative">
                <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input
                  type={field.type}
                  {...register(field.name)}
                  onChange={(e) => {
                    const val = field.mask ? field.mask(e.target.value) : e.target.value
                    setValue(field.name, val, { shouldValidate: true })
                  }}
                  placeholder={field.placeholder}
                  className="input-field pl-10"
                  autoComplete={field.autoComplete}
                />
              </div>
              {errors[field.name] && (
                <p className="text-red-400 text-xs mt-1">
                  {errors[field.name]?.message}
                </p>
              )}
            </motion.div>
          ))}

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Crie uma senha forte"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Confirme sua senha"
                className="input-field pl-10 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </motion.div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms')}
                className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500/50"
              />
              <span className="text-sm text-dark-400">
                Li e aceito os{' '}
                <Link href="#" className="text-primary-400 hover:text-primary-300">
                  Termos de Uso
                </Link>{' '}
                e{' '}
                <Link href="#" className="text-primary-400 hover:text-primary-300">
                  Politica de Privacidade
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-red-400 text-xs mt-1">{errors.terms.message}</p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base font-bold tracking-wider"
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  CRIAR CONTA
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Login Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-center text-sm text-dark-400 mt-6"
        >
          Ja tem conta?{' '}
          <Link
            href="/login"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Entrar
          </Link>
        </motion.p>
      </div>

      {/* Bottom branding */}
      <motion.p
        className="text-center text-xs text-dark-600 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Decria Outlet &mdash; Vapes, Cosmeticos, Oculos & Lupas
      </motion.p>
    </motion.div>
  )
}
